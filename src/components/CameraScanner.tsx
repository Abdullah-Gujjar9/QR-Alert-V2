"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function CameraScanner({
  onScan,
}: {
  onScan: (qrCode: string) => void;
}) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 300,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader" />;
}