import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1 (confusable)

function randomCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `QRA-${s}`;
}

function randomSlug(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return s;
}

// ── POST /api/admin/generate-qrs ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { count = 10, base_url } = await req.json();

    if (!base_url) {
      return NextResponse.json(
        { error: "base_url is required (e.g. https://yourdomain.com)" },
        { status: 400 }
      );
    }

    const batchSize = Math.min(Math.max(Number(count) || 10, 1), 200);
    const db = supabaseAdmin();

    // Fetch all existing codes to guarantee uniqueness
    const { data: existing } = await db
      .from("stickers")
      .select("activation_code, qr_code");

    const usedCodes = new Set((existing || []).map((r: { activation_code: string }) => r.activation_code));
    const usedSlugs = new Set((existing || []).map((r: { qr_code: string }) => r.qr_code));

    const rows: { activation_code: string; qr_code: string; status: string; scan_url: string }[] = [];

    let attempts = 0;
    while (rows.length < batchSize && attempts < batchSize * 20) {
      attempts++;
      const activation_code = randomCode();
      const qr_code = randomSlug();

      if (usedCodes.has(activation_code) || usedSlugs.has(qr_code)) continue;

      const scan_url = `${base_url.replace(/\/$/, "")}/q/${qr_code}`;

      usedCodes.add(activation_code);
      usedSlugs.add(qr_code);

      rows.push({
        activation_code,
        qr_code,
        status: "unactivated",
        scan_url,
      });
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Could not generate unique codes. Try again." },
        { status: 500 }
      );
    }

    // Insert into Supabase (scan_url stored for reference)
    const insertRows = rows.map(({ activation_code, qr_code, status }) => ({
      activation_code,
      qr_code,
      status,
    }));

    const { error: insertErr } = await db.from("stickers").insert(insertRows);

    if (insertErr) {
      console.error("Insert error:", insertErr);
      return NextResponse.json(
        { error: "Database insert failed: " + insertErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generated: rows.length,
      codes: rows, // includes activation_code, qr_code, scan_url
    });
  } catch (err) {
    console.error("Generate QRs error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// ── GET /api/admin/generate-qrs — list all stickers ─────────────────────────

export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("stickers")
      .select(
        "id, activation_code, qr_code, status, created_at, activated_at, owner_first_name, plate_number, scan_count"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ stickers: data || [] });
  } catch (err) {
    console.error("List stickers error:", err);
    return NextResponse.json({ error: "Failed to fetch stickers." }, { status: 500 });
  }
}
