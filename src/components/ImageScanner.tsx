"use client";

import jsQR from "jsqr";

export default function ImageScanner({
  onScan,
}: {
  onScan: (qrCode: string) => void;
}) {
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      const canvas = document.createElement("canvas");

      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const qr = jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );

      if (qr) {
        onScan(qr.data);
      }
    };
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleUpload}
      className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
    />
  );
}