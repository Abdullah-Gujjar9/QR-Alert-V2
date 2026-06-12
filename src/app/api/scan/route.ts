import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const vehicle = await prisma.vehicleQR.findUnique({
    where: {
      qrCode: body.qrCode,
    },
  });

  if (vehicle) {
    return NextResponse.json({
      exists: true,
      vehicle,
    });
  }

  return NextResponse.json({
    exists: false,
  });
}