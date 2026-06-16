import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/scan?code=4X7K
// Called by /q/[code] page on load — returns status + safe public data
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

  // Not found in DB at all
  if (error || !sticker) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Suspended
  if (sticker.status === "suspended") {
    return NextResponse.json({ error: "Suspended" }, { status: 403 });
  }

  // Unactivated — return activation_code so scan page can pre-fill the form
  if (sticker.status === "unactivated") {
    return NextResponse.json({
      status: "unactivated",
      activation_code: sticker.activation_code,
    });
  }

  // Activated — return only safe public fields (no phone numbers)
  return NextResponse.json({
    status: "activated",
    data: {
      sticker_id:        sticker.id,
      qr_code:           sticker.qr_code,
      owner_first_name:  sticker.owner_first_name,
      plate_number:      sticker.plate_number,
      vehicle_type:      sticker.vehicle_type,
      vehicle_make:      sticker.vehicle_make,
      vehicle_model:     sticker.vehicle_model,
      vehicle_color:     sticker.vehicle_color,
      note:              sticker.note,
    },
  });
}
