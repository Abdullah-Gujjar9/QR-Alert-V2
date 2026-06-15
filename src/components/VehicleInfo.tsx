interface Vehicle {
  id: string;
  qrCode: string;
  ownerName: string;
  phone: string;
  vehicleNumber: string;
}

interface Props {
  vehicle: Vehicle;
}

export default function VehicleInfo({
  vehicle,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Vehicle Information
      </h2>

      <div className="space-y-4">
        <div>
          <span className="font-semibold">
            Owner Name:
          </span>{" "}
          {vehicle.ownerName}
        </div>

        <div>
          <span className="font-semibold">
            Phone:
          </span>{" "}
          {vehicle.phone}
        </div>

        <div>
          <span className="font-semibold">
            Vehicle Number:
          </span>{" "}
          {vehicle.vehicleNumber}
        </div>

        <div>
          <span className="font-semibold">
            QR Code:
          </span>{" "}
          {vehicle.qrCode}
        </div>
      </div>
    </div>
  );
}