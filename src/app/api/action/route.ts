import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWhatsApp, sendToMany, initiateMaskedCall, msg } from "@/lib/comms";

const AMBULANCE = process.env.AMBULANCE_SMS_NUMBER;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sticker_id, action, message = "", latitude, longitude, image_base64, scanner_phone } = body;

    if (!sticker_id || !action) {
      return NextResponse.json({ error: "Missing sticker_id or action" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Fetch full private sticker data (server-side only)
    const { data: s, error } = await db
      .from("stickers")
      .select("owner_first_name, owner_last_name, owner_phone, owner_whatsapp, emergency_contact_name, emergency_contact_phone, plate_number, vehicle_type, vehicle_make, vehicle_color")
      .eq("id", sticker_id)
      .single();

    if (error || !s) {
      return NextResponse.json({ error: "Sticker not found." }, { status: 404 });
    }

    const ownerName = `${s.owner_first_name} ${s.owner_last_name}`;
    const plate     = s.plate_number;
    let waSent = false, callInitiated = false;
    const smsSent = false;

    // Upload image if provided
    let imagePath: string | null = null;
    if (image_base64) {
      const base64Data = image_base64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${sticker_id}/${action}-${Date.now()}.jpg`;
      await db.storage.from("action-images").upload(filename, buffer, { contentType: "image/jpeg", upsert: false });
      imagePath = filename;
    }

    const gpsLink = latitude && longitude
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : null;

    // ── Action handlers ────────────────────────────────────────────────────────

    if (action === "wrong_parking") {
      const text = msg.wrongParking(plate, message || "No additional message.");
      waSent = await sendWhatsApp(s.owner_whatsapp || s.owner_phone, text);
    }

    else if (action === "call_owner") {
      if (scanner_phone) {
        await initiateMaskedCall(s.owner_phone, scanner_phone);
        callInitiated = true;
      } else {
        // No scanner phone — fall back to WhatsApp notification
        waSent = await sendWhatsApp(s.owner_whatsapp || s.owner_phone,
          `📞 *QRAlert* — Someone scanned your QR tag (${plate}) and wants to reach you. Please call back or check your vehicle.`);
      }
    }

    else if (action === "emergency") {
      const ownerText   = msg.emergencyOwner(plate, message || "No details provided.");
      const contactText = msg.emergencyContact(ownerName, plate, message || "No details provided.");
      const [r1] = await Promise.allSettled([
        sendWhatsApp(s.owner_whatsapp || s.owner_phone, ownerText),
        s.emergency_contact_phone ? sendWhatsApp(s.emergency_contact_phone, contactText) : Promise.resolve(),
      ]);
      waSent = (r1.status === "fulfilled" && r1.value === true);
    }

    else if (action === "accident") {
      const ownerText   = msg.accidentOwner(plate);
      const contactText = msg.accidentContact(ownerName, plate, gpsLink || undefined);
      await sendToMany(
        [s.owner_whatsapp || s.owner_phone, s.emergency_contact_phone],
        ownerName + " | " + contactText
      );
      await sendToMany([s.owner_phone, s.emergency_contact_phone], ownerText);
      waSent = true;
      // SMS ambulance
      if (AMBULANCE && gpsLink) {
        await sendWhatsApp(AMBULANCE, msg.ambulance(plate, s.vehicle_color || "", s.vehicle_type || "", gpsLink)).catch(() => {});
      }
    }

    // Audit log
    await db.from("actions").insert({
      sticker_id, action_type: action, message,
      latitude: latitude ?? null, longitude: longitude ?? null,
      image_path: imagePath, wa_sent: waSent, sms_sent: smsSent, call_initiated: callInitiated,
    });

    return NextResponse.json({
      success: true,
      message: successMsg(action),
      wa_sent: waSent, call_initiated: callInitiated,
    });
  } catch (err) {
    console.error("Action error:", err);
    return NextResponse.json({ error: "Failed to send alert. Please call emergency services directly." }, { status: 500 });
  }
}

function successMsg(action: string) {
  return ({
    wrong_parking: "Owner notified via WhatsApp about the parking issue.",
    call_owner:    "Connecting call through our secure masked line.",
    emergency:     "Emergency alert sent to owner and emergency contact.",
    accident:      "Accident alert sent. Emergency services notified.",
  } as Record<string,string>)[action] ?? "Done.";
}
