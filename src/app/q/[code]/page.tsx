"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ShieldAlert, Car, Phone, AlertTriangle, MapPin,
  X, Camera, Loader2, CheckCircle2, WifiOff,
  MessageSquare, Upload, PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { fileToBase64, vehicleLabel } from "@/lib/utils";
import type { PublicScanView, ActionType } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type PageState = "loading" | "unactivated" | "activated" | "error" | "suspended";
type ModalType = ActionType | null;
type ActionState = "idle" | "sending" | "done" | "error";

// ─── Mock data for /q/DEMO ────────────────────────────────────────────────────
const DEMO: PublicScanView = {
  sticker_id: "demo", qr_code: "DEMO", owner_first_name: "Ali",
  plate_number: "ABC-1234", vehicle_type: "Car", vehicle_make: "Toyota",
  vehicle_model: "Corolla", vehicle_color: "White", note: "If I'm blocking you, call me and I'll move right away!",
};

export default function ScanPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [data, setData] = useState<PublicScanView | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [activationCode, setActivationCode] = useState("");
  const actions = [
  {
    title: "Report Wrong Parking",
    description:
      "Attach a photo and notify the owner via WhatsApp instantly — no number shared.",
  },
  {
    title: "Call the Owner",
    description:
      "One-tap masked call through Twilio Proxy — neither party's real number is ever exposed.",
  },
  {
    title: "Report Emergency",
    description:
      "Send an emergency WhatsApp + photo to the owner and their emergency contact at once.",
  },
  {
    title: "Accident Concern",
    description:
      "Share GPS location with emergency services, alert family, and attach accident photo.",
  },
];

  // Fetch sticker info
  useEffect(() => {
    if (!code) return;
    if (code.toUpperCase() === "DEMO") {
      setTimeout(() => { setData(DEMO); setPageState("activated"); }, 800);
      return;
    }
    axios.get(`/api/scan?code=${code.toUpperCase()}`)
      .then((res) => {
        if (res.data.status === "unactivated") {
          setActivationCode(res.data.activation_code || "");
          setPageState("unactivated");
        } else {
          setData(res.data.data);
          setPageState("activated");
        }
      })
      .catch((err) => {
        if (err.response?.status === 403) setPageState("suspended");
        else setPageState("error");
      });
  }, [code]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-danger-100 flex items-center justify-center">
              <ShieldAlert size={30} className="text-danger-600" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-danger-400 animate-ping opacity-30" />
          </div>
          <p className="text-ink-500 font-medium">Loading vehicle info…</p>
          <Loader2 size={18} className="animate-spin text-ink-300" />
        </div>
      </Shell>
    );
  }

  // ── Unactivated ──────────────────────────────────────────────────────────
  if (pageState === "unactivated") {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-16 gap-5 text-center animate-fade-up px-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
            <ShieldAlert size={30} className="text-amber-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-950">Sticker not activated yet</h2>
          <p className="text-ink-500 text-sm max-w-xs">This QRAlert sticker hasn't been set up. If you're the owner, activate it now.</p>
          <Button variant="amber" size="lg" onClick={() => router.push(`/activate/${activationCode || "start"}`)}>
            Activate this sticker
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Error / Suspended ────────────────────────────────────────────────────
  if (pageState === "error" || pageState === "suspended" || !data) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-2 animate-fade-up">
          <WifiOff size={44} className="text-ink-300" />
          <h2 className="font-display text-2xl font-bold text-ink-900">
            {pageState === "suspended" ? "Sticker suspended" : "Not found"}
          </h2>
          <p className="text-ink-500 text-sm max-w-xs">
            {pageState === "suspended"
              ? "This sticker has been suspended by the owner."
              : "This QR code is invalid or has been removed."}
          </p>
        </div>
      </Shell>
    );
  }

  // ── Activated ─────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="max-w-sm mx-auto px-4 py-6 animate-fade-up space-y-5">

        {/* Vehicle card */}
        <div className="rounded-3xl bg-ink-950 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            {data.vehicle_type === "Bike"
              ? <span className="text-4xl">🏍️</span>
              : <span className="text-4xl">🚗</span>}
          </div>
          <p className="text-xs text-ink-400 uppercase tracking-widest mb-1">Vehicle owner</p>
          <h1 className="font-display text-3xl font-bold">{data.owner_first_name}</h1>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink-800 px-4 py-1.5">
            <span className="text-sm font-mono font-bold tracking-widest text-white">{data.plate_number}</span>
          </div>
          {vehicleLabel(data) && (
            <p className="mt-2 text-sm text-ink-400">{vehicleLabel(data)}</p>
          )}
        </div>

        {/* Owner note */}
        {data.note && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-3 items-start">
            <MessageSquare size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 italic">"{data.note}"</p>
          </div>
        )}

        {/* 4 action buttons */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-400 text-center">What do you need?</p>

          <ActionButton
            icon={Car}
            label="Report Wrong Parking"
            sub="Send photo + WhatsApp alert to owner"
            color="amber"
            onClick={() => setModal("wrong_parking")}
          />
          <ActionButton
            icon={Phone}
            label="Call the Owner"
            sub="Masked call — your number stays private"
            color="green"
            onClick={() => setModal("call_owner")}
          />
          <ActionButton
            icon={AlertTriangle}
            label="Report Emergency"
            sub="Alert owner + emergency contact via WhatsApp"
            color="orange"
            onClick={() => setModal("emergency")}
          />
          <ActionButton
            icon={MapPin}
            label="Accident Concern"
            sub="Share location + alert family + contact ambulance"
            color="red"
            onClick={() => setModal("accident")}
          />
        </div>

        <p className="text-center text-xs text-ink-300 pt-2">
          Powered by <span className="font-semibold text-ink-500">QRAlert</span> · All contacts protected
        </p>
      </div>

      {/* Modals */}
      {modal && (
        <ActionModal
          modal={modal}
          stickerId={data.sticker_id}
          ownerName={data.owner_first_name}
          plate={data.plate_number}
          onClose={() => setModal(null)}
        />
      )}
    </Shell>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionButton({ icon: Icon, label, sub, color, onClick }: {
  icon: React.ElementType; label: string; sub: string;
  color: "amber" | "green" | "orange" | "red"; onClick: () => void;
}) {
  const styles: Record<string, string> = {
    amber:  "border-amber-200 bg-amber-50 hover:bg-amber-100 active:bg-amber-200",
    green:  "border-brand-200 bg-brand-50  hover:bg-brand-100  active:bg-brand-200",
    orange: "border-orange-200 bg-orange-50 hover:bg-orange-100 active:bg-orange-200",
    red:    "border-danger-200 bg-danger-50 hover:bg-danger-100 active:bg-danger-200",
  };
  const iconStyles: Record<string, string> = {
    amber:  "text-amber-600",
    green:  "text-brand-600",
    orange: "text-orange-600",
    red:    "text-danger-600",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${styles[color]}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm`}>
        <Icon size={22} className={iconStyles[color]} />
      </div>
      <div>
        <p className="font-bold text-ink-950 text-sm leading-tight">{label}</p>
        <p className="text-xs text-ink-500 mt-0.5">{sub}</p>
      </div>
    </button>
  );
}

// ─── Action modal ─────────────────────────────────────────────────────────────
function ActionModal({ modal, stickerId, ownerName, plate, onClose }: {
  modal: ActionType; stickerId: string; ownerName: string; plate: string; onClose: () => void;
}) {
  const [message, setMessage]       = useState("");
  const [image, setImage]           = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannerPhone, setScannerPhone] = useState("");
  const [location, setLocation]     = useState<{ lat: number; lng: number } | null>(null);
  const [gpsState, setGpsState]     = useState<"idle" | "loading" | "got" | "denied">("idle");
  const [actionState, setActionState] = useState<ActionState>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const config: Record<ActionType, { title: string; color: string; btnLabel: string; btnVariant: "amber"|"whatsapp"|"danger"|"primary" }> = {
    wrong_parking: { title: "Report Wrong Parking",  color: "amber",    btnLabel: "Send parking alert",  btnVariant: "amber" },
    call_owner:    { title: "Call the Owner",         color: "green",    btnLabel: "Connect masked call", btnVariant: "whatsapp" },
    emergency:     { title: "Report Emergency",       color: "orange",   btnLabel: "Send emergency alert", btnVariant: "danger" },
    accident:      { title: "Accident Concern",       color: "red",      btnLabel: "Send accident alert", btnVariant: "danger" },
  };
  const cfg = config[modal];

  const handleImage = async (file: File) => {
    setImage(file);
    const b64 = await fileToBase64(file);
    setImagePreview(b64);
  };

  const getGPS = () => {
    if (!navigator.geolocation) { toast("error", "Geolocation not supported."); return; }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsState("got"); },
      () => { setGpsState("denied"); toast("error", "Location permission denied."); },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSend = async () => {
    setActionState("sending");
    try {
      const payload: Record<string, unknown> = {
        sticker_id: stickerId,
        action: modal,
        message,
        ...(location && { latitude: location.lat, longitude: location.lng }),
        ...(scannerPhone && { scanner_phone: scannerPhone }),
      };
      if (image) {
        payload.image_base64 = await fileToBase64(image);
      }
      const res = await axios.post("/api/action", payload);
      setActionState("done");
      toast("success", res.data.message || "Alert sent!");
    } catch (err: unknown) {
      setActionState("error");
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : "Failed to send.";
      toast("error", msg || "Something went wrong. Please try again.");
    }
  };

  // ── Done state ─────────────────────────────────────────────────────────────
  if (actionState === "done") {
    return (
      <Overlay onClose={onClose}>
        <div className="flex flex-col items-center py-10 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
            <CheckCircle2 size={36} className="text-brand-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink-950">
            {modal === "call_owner" ? "Call being connected" : "Alert sent!"}
          </h3>
          <p className="text-sm text-ink-500 max-w-xs">
            {modal === "call_owner"
              ? `Your call to ${ownerName} is being bridged through our masked line. Your number stays private.`
              : `${ownerName} has been notified via WhatsApp. They should respond shortly.`}
          </p>
          <Button variant="outline" size="md" onClick={onClose}>Close</Button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-ink-950">{cfg.title}</h3>

        {/* Call owner — just needs scanner phone for proxy */}
        {modal === "call_owner" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4 text-sm text-brand-800">
              <p className="font-semibold mb-1">🔒 How masked calls work</p>
              <p>Twilio Proxy bridges you and {ownerName}. Neither of you ever sees the other's real number.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-1.5">Your phone number (optional)</label>
              <input
                type="tel"
                value={scannerPhone}
                onChange={(e) => setScannerPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-ink-800"
              />
              <p className="text-xs text-ink-400 mt-1">For full proxy call. Leave blank to send a WhatsApp notification instead.</p>
            </div>
          </div>
        )}

        {/* All other actions */}
        {modal !== "call_owner" && (
          <>
            {/* Message field */}
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-1.5">
                {modal === "wrong_parking" ? "Parking issue details" : "Describe the situation"}
                {modal === "accident" && " *"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={
                  modal === "wrong_parking" ? "e.g. Blocking my garage, please move immediately." :
                  modal === "emergency"     ? "e.g. Owner appears unconscious inside vehicle." :
                  "e.g. Vehicle involved in collision at main road near mall."
                }
                className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-ink-800 resize-none"
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-1.5">
                Attach photo {modal === "wrong_parking" || modal === "accident" ? "(recommended)" : "(optional)"}
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
              />
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-ink-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50 py-6 hover:bg-ink-100 transition-colors"
                >
                  <Camera size={24} className="text-ink-400" />
                  <span className="text-sm text-ink-500 font-medium">Take photo or choose from gallery</span>
                </button>
              )}
            </div>

            {/* GPS — required for accident */}
            {(modal === "accident" || modal === "emergency") && (
              <div>
                <p className="text-sm font-semibold text-ink-800 mb-1.5">
                  Your location {modal === "accident" && <span className="text-danger-600">*</span>}
                </p>
                {gpsState === "got" && location ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-50 border border-brand-200 px-4 py-3">
                    <MapPin size={16} className="text-brand-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-brand-700">Location captured</p>
                      <p className="text-xs text-brand-600 font-mono">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                    </div>
                    <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target="_blank" rel="noopener" className="text-xs font-bold text-brand-700 underline">View</a>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={getGPS}
                    isLoading={gpsState === "loading"}
                    className="border-2 border-ink-200"
                  >
                    <MapPin size={16} />
                    {gpsState === "denied" ? "Permission denied" : "Share my location"}
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Send button */}
        <Button
          variant={cfg.btnVariant}
          size="lg"
          fullWidth
          onClick={handleSend}
          isLoading={actionState === "sending"}
          disabled={
            actionState === "sending" ||
            (modal === "accident" && !message.trim())
          }
        >
          {actionState === "sending" ? "Sending…" : cfg.btnLabel}
        </Button>

        {modal === "accident" && (
          <p className="text-center text-xs text-ink-400">
            In life-threatening emergencies call <strong>1122</strong> or <strong>115</strong> directly.
          </p>
        )}
      </div>
    </Overlay>
  );
}

// ─── Shell & Overlay ──────────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink-50">
      <div className="sticky top-0 z-30 bg-danger-600 text-white px-4 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md">
        <ShieldAlert size={14} />
        QRAlert — Vehicle Emergency System
        <ShieldAlert size={14} />
      </div>
      <div className="pb-8">{children}</div>
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90dvh] overflow-y-auto animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 hover:bg-ink-200 transition-colors">
          <X size={16} className="text-ink-600" />
        </button>
        {children}
      </div>
    </div>
  );
}
