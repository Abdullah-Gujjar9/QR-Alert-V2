interface Props {
  qrCode: string;
}

export default function VehicleForm({
  qrCode,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Register Vehicle
      </h2>

      <div className="mb-6">
        <label className="font-semibold block mb-2">
          QR Code
        </label>

        <div className="border rounded-lg p-3 bg-gray-50">
          {qrCode}
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block mb-2">
            Owner Name
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Enter owner name"
          />
        </div>

        <div>
          <label className="block mb-2">
            Phone Number
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block mb-2">
            Vehicle Number
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Enter vehicle number"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Save Vehicle
        </button>
      </form>
    </div>
  );
}