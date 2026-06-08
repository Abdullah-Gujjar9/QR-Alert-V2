import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toE164(phone: string, defaultCountry = "92"): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) return `+${d.slice(2)}`;
  if (d.startsWith("0"))  return `+${defaultCountry}${d.slice(1)}`;
  if (!phone.trim().startsWith("+")) return `+${d}`;
  return `+${d}`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export function vehicleLabel(v: { vehicle_color?: string; vehicle_make?: string; vehicle_model?: string; vehicle_type?: string }) {
  return [v.vehicle_color, v.vehicle_make, v.vehicle_model || v.vehicle_type]
    .filter(Boolean).join(" ");
}
