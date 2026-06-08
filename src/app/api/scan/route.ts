import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase().trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("stickers")
    .select("id, qr_code, status, owner_first_name, plate_number, vehicle_type, vehicle_make, vehicle_model, vehicle_color, note, scan_count, activation_code")
    .eq("qr_code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "QR code not found." }, { status: 404 });
  }

  if (data.status === "unactivated") {
    return NextResponse.json({
      status: "unactivated",
      activation_code: data.activation_code,
      qr_code: data.qr_code,
    }, { status: 202 });
  }

  if (data.status === "suspended") {
    return NextResponse.json({ error: "This sticker has been suspended." }, { status: 403 });
  }

  db.from("stickers").update({ scan_count: (data.scan_count || 0) + 1 }).eq("id", data.id).then(() => {});

  return NextResponse.json({
    status: "activated",
    data: {
      sticker_id:       data.id,
      qr_code:          data.qr_code,
      owner_first_name: data.owner_first_name,
      plate_number:     data.plate_number,
      vehicle_type:     data.vehicle_type  || "",
      vehicle_make:     data.vehicle_make  || "",
      vehicle_model:    data.vehicle_model || "",
      vehicle_color:    data.vehicle_color || "",
      note:             data.note          || "",
    },
  });
}
