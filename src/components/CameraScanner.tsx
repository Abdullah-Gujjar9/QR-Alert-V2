"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

export default function CameraScanner({
  onScan,
}: {
  onScan: (qrCode: string) => void;
}) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!readerRef.current) return;

    // Initialize scanner only once
    scannerRef.current = new Html5QrcodeScanner(
      readerRef.current.id,
      {
        fps: 10,
        qrbox: 300,
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        // Stop scanner after success
        scannerRef.current
          ?.clear()
          .catch(() => {});

        onScan(decodedText);
      },
      () => {
        // ignore scan errors
      }
    );

    // Cleanup on unmount
    return () => {
      scannerRef.current
        ?.clear()
        .catch(() => {});
      scannerRef.current = null;
    };
  }, [onScan]);

  return <div id="reader" ref={readerRef} />;
}