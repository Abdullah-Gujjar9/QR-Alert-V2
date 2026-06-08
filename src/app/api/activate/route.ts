import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toE164 } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = supabaseAdmin();

    // 1. Look up sticker by activation code
    const code = (body.activation_code || "").toUpperCase().trim();
    const { data: sticker, error } = await db
      .from("stickers")
      .select("id, status, qr_code")
      .eq("activation_code", code)
      .single();

    if (error || !sticker) {
      return NextResponse.json({ error: "Invalid activation code. Please check the code on your sticker." }, { status: 404 });
    }
    if (sticker.status === "activated") {
      return NextResponse.json({ error: "This sticker is already activated." }, { status: 409 });
    }
    if (sticker.status === "suspended") {
      return NextResponse.json({ error: "This sticker has been suspended. Contact support." }, { status: 403 });
    }

    // 2. Validate required fields
    const required = ["owner_first_name","owner_last_name","owner_phone","plate_number","vehicle_type"];
    for (const f of required) {
      if (!body[f]?.trim()) {
        return NextResponse.json({ error: `${f.replace(/_/g," ")} is required.` }, { status: 400 });
      }
    }

    // 3. Normalise phones
    const ownerPhone     = toE164(body.owner_phone);
    const ownerWhatsapp  = body.owner_whatsapp ? toE164(body.owner_whatsapp) : ownerPhone;
    const emergencyPhone = body.emergency_contact_phone ? toE164(body.emergency_contact_phone) : null;

    // 4. Persist
    const { error: upErr } = await db.from("stickers").update({
      status:                  "activated",
      activated_at:            new Date().toISOString(),
      owner_first_name:        body.owner_first_name.trim(),
      owner_last_name:         body.owner_last_name.trim(),
      owner_phone:             ownerPhone,
      owner_whatsapp:          ownerWhatsapp,
      emergency_contact_name:  body.emergency_contact_name?.trim()  || null,
      emergency_contact_phone: emergencyPhone,
      plate_number:            body.plate_number.trim().toUpperCase(),
      vehicle_type:            body.vehicle_type,
      vehicle_make:            body.vehicle_make?.trim()  || null,
      vehicle_model:           body.vehicle_model?.trim() || null,
      vehicle_color:           body.vehicle_color?.trim() || null,
      vehicle_year:            body.vehicle_year?.trim()  || null,
      note:                    body.note?.trim()           || null,
    }).eq("id", sticker.id);

    if (upErr) throw upErr;

    return NextResponse.json({ success: true, qr_code: sticker.qr_code });
  } catch (err) {
    console.error("Activate error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
