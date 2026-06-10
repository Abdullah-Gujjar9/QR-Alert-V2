"use client";

import { useState } from "react";
import Link from "next/link";
import CameraScanner from "@/components/CameraScanner";
import ImageScanner from "@/components/ImageScanner";

export default function ScanPage() {
  const [tab, setTab] = useState<"camera" | "image">("camera");
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [invalidQR, setInvalidQR] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const handleScan = async (code: string) => {
    setQrCode(code);
    setLoading(true);
    setVehicle(null);
    setInvalidQR(false);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode: code,
        }),
      });

      const data = await res.json();

      if (data.exists) {
        setVehicle(data.vehicle);
        setInvalidQR(false);
      } else {
        setVehicle(null);
        setInvalidQR(true);
      }
    } catch (error) {
      console.error(error);
      setVehicle(null);
      setInvalidQR(true);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-black text-white p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">

        {/* Header */}
        <div className="shrink-0 mb-4">
          <h1 className="text-4xl font-bold text-red-600">
            QR Alert Scanner
          </h1>

          <p className="text-zinc-400 mt-2">
            Scan QR stickers using camera or image upload
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">

          {/* Left Panel */}
          <div className="bg-zinc-900 border border-red-600 rounded-2xl p-6 h-full overflow-hidden flex flex-col">

            <div className="flex gap-4 mb-6 shrink-0">

              <button
                onClick={() => setTab("camera")}
                className={`px-5 py-2 rounded-lg transition ${
                  tab === "camera"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                📷 Camera Scan
              </button>

              <button
                onClick={() => setTab("image")}
                className={`px-5 py-2 rounded-lg transition ${
                  tab === "image"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                🖼 Upload Image
              </button>

            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {tab === "camera" ? (
                <CameraScanner onScan={handleScan} />
              ) : (
                <ImageScanner onScan={handleScan} />
              )}
            </div>

          </div>

          {/* Right Panel */}
          <div className="bg-zinc-900 border border-red-600 rounded-2xl p-6 h-full overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">
              Scan Result
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-300">
                  Checking QR Code...
                </p>
              </div>
            )}

            {!loading && vehicle && (
              <>
                <div className="bg-green-600 text-white inline-block px-4 py-2 rounded-lg mb-6 font-semibold">
                  ✅ QR VERIFIED
                </div>

                <div className="bg-zinc-800 rounded-xl p-4 mb-6 space-y-3">

                  <div>
                    <p className="text-zinc-400 text-sm">
                      Owner
                    </p>
                    <p className="font-medium">
                      {vehicle.ownerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-400 text-sm">
                      Vehicle
                    </p>
                    <p className="font-medium">
                      {vehicle.vehicleName}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-400 text-sm">
                      Number Plate
                    </p>
                    <p className="font-medium">
                      {vehicle.numberPlate}
                    </p>
                  </div>

                </div>

                <div className="grid gap-3">

                  <button className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-medium">
                    🚗 Report Wrong Parking
                  </button>

                  <button
                    onClick={() =>
                      window.location.href =
                        "tel:" + vehicle.phone
                    }
                    className="w-full bg-zinc-700 hover:bg-zinc-600 transition p-3 rounded-xl font-medium"
                  >
                    📞 Call Owner
                  </button>

                  <button className="w-full bg-red-700 hover:bg-red-800 transition p-3 rounded-xl font-medium">
                    🚨 Report Emergency
                  </button>

                  <button className="w-full bg-zinc-800 hover:bg-zinc-700 transition p-3 rounded-xl font-medium border border-zinc-700">
                    ⚠️ Accident Concern
                  </button>

                </div>
              </>
            )}

            {!loading && invalidQR && (
              <div className="flex flex-col items-center justify-center h-full text-center">

                <div className="text-red-500 text-7xl mb-4">
                  ⚠️
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  Invalid QR Code
                </h3>

                <p className="text-zinc-400 mb-6 max-w-md">
                  This QR sticker is not registered in our
                  database. Activate it to link it with a
                  vehicle owner.
                </p>

                <Link
                  href="/activate/new"
                  className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-medium"
                >
                  Activate Sticker
                </Link>

              </div>
            )}

            {!loading && !vehicle && !invalidQR && (
              <div className="flex flex-col items-center justify-center h-full text-center">

                <div className="text-7xl mb-4">
                  📱
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  Ready to Scan
                </h3>

                <p className="text-zinc-500">
                  Scan a QR code using your camera or upload
                  an image to view details.
                </p>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}