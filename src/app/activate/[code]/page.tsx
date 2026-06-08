"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  ShieldAlert, User, Phone, Car, KeyRound,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import type { ActivationFormData } from "@/types";

const VEHICLE_TYPES = [
  { value: "", label: "Select type…" },
  { value: "Car",   label: "🚗 Car" },
  { value: "Bike",  label: "🏍️ Bike / Motorcycle" },
  { value: "Truck", label: "🚛 Truck" },
  { value: "Van",   label: "🚐 Van / Minivan" },
  { value: "Other", label: "Other" },
];

const COLORS = ["White","Black","Silver","Grey","Red","Blue","Green","Yellow","Orange","Brown","Gold","Beige","Other"].map(c => ({ value: c, label: c }));
const COLORS_WITH_PROMPT = [{ value: "", label: "Select color…" }, ...COLORS];

type Step = "owner" | "vehicle" | "activation" | "done";

export default function ActivatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("owner");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues, trigger, setValue, watch } = useForm<ActivationFormData>({
    defaultValues: {
      activation_code: "",
      owner_first_name: "", owner_last_name: "", owner_phone: "", owner_whatsapp: "",
      emergency_contact_name: "", emergency_contact_phone: "",
      plate_number: "", vehicle_type: "", vehicle_make: "", vehicle_model: "", vehicle_color: "", vehicle_year: "", note: "",
    },
  });

  const steps: Step[] = ["owner", "vehicle", "activation"];
  const stepIdx = steps.indexOf(step);

  async function next() {
    let fieldsToValidate: (keyof ActivationFormData)[] = [];
    if (step === "owner")       fieldsToValidate = ["owner_first_name","owner_last_name","owner_phone"];
    if (step === "vehicle")     fieldsToValidate = ["plate_number","vehicle_type"];
    if (step === "activation")  fieldsToValidate = ["activation_code"];

    const ok = await trigger(fieldsToValidate);
    if (!ok) return;

    if (step === "owner")      setStep("vehicle");
    else if (step === "vehicle") setStep("activation");
  }

  function back() {
    if (step === "vehicle")    setStep("owner");
    if (step === "activation") setStep("vehicle");
  }

  const onSubmit = async (data: ActivationFormData) => {
    setSubmitting(true);
    try {
      await axios.post("/api/activate", data);
      setStep("done");
      toast("success", "Sticker activated! Your QR tag is now live.");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : "Something went wrong.";
      toast("error", msg || "Failed to activate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Done screen ────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 animate-fade-up">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
            <CheckCircle2 size={44} className="text-brand-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-950">Sticker activated!</h1>
          <p className="text-ink-500 max-w-xs">Your QRAlert tag is now live. Anyone who scans it will see your vehicle info and can contact you securely.</p>
          <Button variant="primary" size="lg" onClick={() => router.push("/")}>Back to home</Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[
            { key: "owner",      label: "Your info",      icon: User },
            { key: "vehicle",    label: "Vehicle",        icon: Car },
            { key: "activation", label: "Activation code", icon: KeyRound },
          ].map(({ key, label, icon: Icon }, i) => {
            const current = stepIdx === i;
            const done    = stepIdx > i;
            return (
              <div key={key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    done ? "bg-brand-600 text-white" : current ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-400"
                  }`}>
                    {done ? <CheckCircle2 size={17} /> : <Icon size={17} />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${current ? "text-ink-900" : "text-ink-400"}`}>{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${stepIdx > i ? "bg-brand-500" : "bg-ink-200"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Step 1: Owner info ── */}
        {step === "owner" && (
          <div className="space-y-5 animate-fade-up">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950 mb-1">Your information</h2>
              <p className="text-sm text-ink-400">This is stored securely — scanners will only see your first name.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" required placeholder="Ali"
                {...register("owner_first_name", { required: "Required" })} error={errors.owner_first_name?.message} />
              <Input label="Last name" required placeholder="Khan"
                {...register("owner_last_name", { required: "Required" })} error={errors.owner_last_name?.message} />
            </div>
            <Input label="Phone number (WhatsApp)" required type="tel" placeholder="+92 300 1234567"
              hint="Alerts will be sent here via WhatsApp — this number stays hidden from scanners"
              left={<Phone size={14} />}
              {...register("owner_phone", { required: "Phone is required" })} error={errors.owner_phone?.message} />
            <Input label="WhatsApp number (if different)" type="tel" placeholder="+92 321 9876543"
              hint="Leave blank to use the same number"
              left={<Phone size={14} />}
              {...register("owner_whatsapp")} />
            <hr className="border-ink-100" />
            <p className="text-sm font-semibold text-ink-700">Emergency contact</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contact name" placeholder="Sara Khan"
                {...register("emergency_contact_name")} />
              <Input label="Contact phone" type="tel" placeholder="+92 300 0000000"
                {...register("emergency_contact_phone")} />
            </div>
          </div>
        )}

        {/* ── Step 2: Vehicle info ── */}
        {step === "vehicle" && (
          <div className="space-y-5 animate-fade-up">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950 mb-1">Vehicle details</h2>
              <p className="text-sm text-ink-400">Shown to the scanner so they can identify your vehicle.</p>
            </div>
            <Input label="Plate number" required placeholder="ABC-1234"
              {...register("plate_number", { required: "Plate number is required" })} error={errors.plate_number?.message} />
            <Select label="Vehicle type" required options={VEHICLE_TYPES}
              {...register("vehicle_type", { required: "Please select a type" })} error={errors.vehicle_type?.message} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Make / Brand" placeholder="Toyota" {...register("vehicle_make")} />
              <Input label="Model" placeholder="Corolla" {...register("vehicle_model")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Colour" options={COLORS_WITH_PROMPT} {...register("vehicle_color")} />
              <Input label="Year" placeholder="2022" type="number" {...register("vehicle_year")} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-1.5">Note for scanners (optional)</label>
              <textarea
                className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-ink-800 resize-none"
                rows={3}
                placeholder="e.g. If I'm blocking you, call me and I'll move immediately."
                {...register("note")}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Activation code ── */}
        {step === "activation" && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950 mb-1">Enter activation code</h2>
              <p className="text-sm text-ink-400">Find the unique code printed on the back or side of your QRAlert sticker.</p>
            </div>
            <div className="rounded-2xl bg-ink-950 p-6 text-center">
              <KeyRound size={32} className="text-ink-400 mx-auto mb-3" />
              <p className="text-xs text-ink-400 uppercase tracking-widest mb-3">Activation code</p>
              <input
                type="text"
                className="w-full rounded-xl bg-ink-800 border-2 border-ink-700 px-4 py-4 text-center text-2xl font-display font-bold text-white tracking-[0.3em] placeholder:text-ink-600 focus:outline-none focus:border-danger-500 uppercase"
                placeholder="QRA-XXXX"
                {...register("activation_code", { required: "Activation code is required" })}
                onChange={(e) => setValue("activation_code", e.target.value.toUpperCase())}
              />
              {errors.activation_code && <p className="mt-2 text-sm text-danger-400">{errors.activation_code.message}</p>}
            </div>
            {/* Summary */}
            <div className="rounded-2xl bg-ink-50 border border-ink-200 p-5 space-y-2 text-sm">
              <p className="font-semibold text-ink-700 mb-3">Confirm your details</p>
              {[
                ["Name",    `${getValues("owner_first_name")} ${getValues("owner_last_name")}`],
                ["Phone",   getValues("owner_phone")],
                ["Plate",   getValues("plate_number")],
                ["Vehicle", `${getValues("vehicle_color")} ${getValues("vehicle_make")} ${getValues("vehicle_model")} ${getValues("vehicle_type")}`.trim()],
              ].map(([k,v]) => v && v.trim() !== "" && (
                <div key={k} className="flex justify-between">
                  <span className="text-ink-400">{k}</span>
                  <span className="font-medium text-ink-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3">
          {step !== "owner" && (
            <Button type="button" variant="ghost" size="lg" onClick={back}>
              <ChevronLeft size={18} /> Back
            </Button>
          )}
          {step !== "activation" ? (
            <Button type="button" variant="primary" size="lg" fullWidth onClick={next}>
              Continue <ChevronRight size={18} />
            </Button>
          ) : (
            <Button type="submit" variant="danger" size="lg" fullWidth isLoading={submitting}>
              {submitting ? "Activating…" : "Activate sticker"}
              {!submitting && <ShieldAlert size={18} />}
            </Button>
          )}
        </div>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 py-10 px-4">
      <div className="mx-auto max-w-lg">
        {/* Logo bar */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-600 text-white">
            <ShieldAlert size={17} />
          </div>
          <span className="font-display text-lg font-bold text-ink-950">QR<span className="text-danger-600">Alert</span></span>
        </div>
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-ink-100">
          {children}
        </div>
      </div>
    </div>
  );
}
