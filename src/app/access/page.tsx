import { Suspense } from "react";
import AccessContent from "./AccessContent";

export default function AccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <AccessContent />
    </Suspense>
  );
}