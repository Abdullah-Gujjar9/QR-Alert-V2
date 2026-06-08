// ─── Sticker / QR Code ───────────────────────────────────────────────────────
export type StickerStatus = "unactivated" | "activated" | "suspended";

export interface Sticker {
  id: string;
  activation_code: string;   // printed on physical sticker e.g. "QRA-4X7K"
  qr_code: string;           // slug in URL  e.g. "4X7K"  (same as last segment)
  status: StickerStatus;
  created_at: string;
  activated_at?: string;
  // populated after activation:
  owner_first_name?: string;
  owner_last_name?: string;
  owner_phone?: string;      // stored encrypted / never exposed to scanner
  owner_whatsapp?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  plate_number?: string;
  vehicle_type?: string;     // Car | Bike | Truck | Other
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_year?: string;
  note?: string;             // owner note shown on scan page
  scan_count: number;
}

// ─── Activation form ─────────────────────────────────────────────────────────
export interface ActivationFormData {
  activation_code: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_whatsapp: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  plate_number: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_year: string;
  note: string;
}

// ─── Public scan view (stripped — no real phones) ────────────────────────────
export interface PublicScanView {
  sticker_id: string;
  qr_code: string;
  owner_first_name: string;
  plate_number: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  note: string;
}

// ─── Action payloads sent to API ─────────────────────────────────────────────
export type ActionType =
  | "wrong_parking"
  | "call_owner"
  | "emergency"
  | "accident";

export interface ActionPayload {
  sticker_id: string;
  action: ActionType;
  message?: string;
  image_base64?: string;       // data-URL of attached image
  latitude?: number;
  longitude?: number;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  call_initiated?: boolean;
  sms_sent?: boolean;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface AdminStats {
  total: number;
  activated: number;
  unactivated: number;
  suspended: number;
}
