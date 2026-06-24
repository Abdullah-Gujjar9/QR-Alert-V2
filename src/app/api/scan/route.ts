import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/scan?code=XXXX
 * Returns sticker status + safe public data
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: sticker, error } = await db
    .from("stickers")
    .select(
      "id, activation_code, qr_code, status, owner_first_name, plate_number, vehicle_type, vehicle_make, vehicle_model, vehicle_color, note"
    )
    .eq("qr_code", code)
    .single();

  // Not found
  if (error || !sticker) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Suspended
  if (sticker.status === "suspended") {
    return NextResponse.json({ error: "Suspended" }, { status: 403 });
  }

  // Unactivated
  if (sticker.status === "unactivated") {
    return NextResponse.json({
      status: "unactivated",
      activation_code: sticker.activation_code,
    });
  }

  // Activated (safe data only)
  return NextResponse.json({
    status: "activated",
    data: {
      sticker_id: sticker.id,
      qr_code: sticker.qr_code,
      owner_first_name: sticker.owner_first_name,
      plate_number: sticker.plate_number,
      vehicle_type: sticker.vehicle_type,
      vehicle_make: sticker.vehicle_make,
      vehicle_model: sticker.vehicle_model,
      vehicle_color: sticker.vehicle_color,
      note: sticker.note,
    },
  });
}

/**
 * POST /api/scan
 * Returns owner + vehicle details (includes phone)
 */
export async function POST(req: Request) {
  const body = await req.json();
  const db = supabaseAdmin();

  const { data: sticker, error } = await db
    .from("stickers")
    .select(
      "owner_first_name, owner_last_name, owner_phone, plate_number, vehicle_type, vehicle_make, vehicle_model, vehicle_color"
    )
    .eq("qr_code", body.qrCode)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!sticker) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }

  const vehicleName = [
    sticker.vehicle_color,
    sticker.vehicle_make,
    sticker.vehicle_model,
    sticker.vehicle_type,
  ]
    .filter(Boolean)
    .join(" ");

  return NextResponse.json({
    exists: true,
    vehicle: {
      ownerName: [sticker.owner_first_name, sticker.owner_last_name]
        .filter(Boolean)
        .join(" "),
      vehicleName: vehicleName || "Registered vehicle",
      numberPlate: sticker.plate_number ?? "Not provided",
      phone: sticker.owner_phone ?? "",
    },
  });
}