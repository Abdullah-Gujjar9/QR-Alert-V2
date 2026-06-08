"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastMsg { id: string; type: "success" | "error"; message: string }

let _add: ((t: Omit<ToastMsg, "id">) => void) | null = null;

export function toast(type: "success" | "error", message: string) {
  _add?.({ type, message });
}

function ToastItem({ t, onDismiss }: { t: ToastMsg; onDismiss: (id: string) => void }) {
  useEffect(() => { const x = setTimeout(() => onDismiss(t.id), 4500); return () => clearTimeout(x); }, [t.id, onDismiss]);
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl p-4 shadow-xl text-white text-sm font-medium animate-fade-up max-w-sm w-full", t.type === "success" ? "bg-ink-900" : "bg-danger-600")}>
      {t.type === "success" ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
      <span className="flex-1">{t.message}</span>
      <button onClick={() => onDismiss(t.id)}><X size={15} /></button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  useEffect(() => {
    _add = (t) => setToasts((p) => [...p, { ...t, id: Math.random().toString(36).slice(2) }]);
    return () => { _add = null; };
  }, []);
  const dismiss = (id: string) => setToasts((p) => p.filter((t) => t.id !== id));
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => <div key={t.id} className="pointer-events-auto"><ToastItem t={t} onDismiss={dismiss} /></div>)}
    </div>
  );
}
