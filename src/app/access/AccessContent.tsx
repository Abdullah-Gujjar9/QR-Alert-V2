"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import VehicleForm from "@/components/VehicleForm";
import VehicleInfo from "@/components/VehicleInfo";

interface Vehicle {
  id: string;
  qrCode: string;
  ownerName: string;
  phone: string;
  vehicleNumber: string;
}

export default function AccessContent() {
  const searchParams = useSearchParams();

  const qrCode = searchParams.get("qrCode");

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!qrCode) {
      setLoading(false);
      return;
    }

    checkQRCode();
  }, [qrCode]);

  const checkQRCode = async () => {
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
      }

      const data = await response.json();

      if (data?.exists && data?.vehicle) {
        setVehicle(data.vehicle);
      } else {
        setVehicle(null);
      }
    } catch (error) {
      console.error("QR Check Error:", error);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      {vehicle ? (
        <VehicleInfo vehicle={vehicle} />
      ) : (
        <VehicleForm qrCode={qrCode || ""} />
      )}
    </main>
  );
}