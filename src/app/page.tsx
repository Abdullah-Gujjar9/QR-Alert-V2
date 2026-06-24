"use client";

import React from "react";
import Link from "next/link";
import ActionCard from "@/components/ui/ActionCard";
import {
  ShieldAlert,
  QrCode,
  Phone,
  AlertTriangle,
  MapPin,
  Car,
  Bike,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-danger-500 selection:text-white">

      {/* NAVBAR */}
      <div className="fixed top-4 left-0 z-50 w-full px-4 sm:px-6">
        <header className="mx-auto max-w-5xl rounded-full border border-ink-200/60 bg-white/70 px-6 py-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-600 text-white shadow-md group-hover:scale-105 transition">
                <ShieldAlert size={19} />
              </div>
              <span className="font-bold text-xl">
                QR<span className="text-danger-600">Alert</span>
              </span>
            </div>

            <nav className="hidden md:flex gap-7 text-sm font-semibold text-ink-600">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#privacy">Privacy</a>
            </nav>

            <Link href="/activate/new" className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-danger-600">
              Activate sticker <ArrowRight size={13} />
            </Link>

          </div>
        </header>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-white pt-28 pb-20 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-danger-600/10 px-4 py-1.5 text-sm text-danger-400">
              <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" />
              Pakistan's First Smart Vehicle Tag
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              One sticker.<br />
              <span className="text-danger-500">Every emergency</span><br />
              handled.
            </h1>

            <p className="text-ink-400 max-w-xl">
              Stick QRAlert on your car or bike. Anyone can reach you securely without seeing your number.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/activate/new" className="bg-danger-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                <QrCode size={18} /> Activate
              </Link>
              <Link href="/q/DEMO" className="border border-white/20 px-6 py-3 rounded-xl">Demo</Link>
              <Link href="/admin/qr-generator" className="border border-white/20 px-6 py-3 rounded-xl">generate</Link>
              <Link href="/activate/scan" className="border border-white/20 px-6 py-3 rounded-xl">Scan</Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex justify-center relative">
            <div className="w-44 h-44 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              QR
            </div>

            <FloatingBadge className="left-0 top-12" color="bg-amber-500" label="Wrong Parking" />
            <FloatingBadge className="-right-4 top-20" color="bg-emerald-500" label="Call Owner" />
            <FloatingBadge className="-left-6 bottom-20" color="bg-rose-500" label="Emergency" />
            <FloatingBadge className="bottom-12 right-2" color="bg-blue-500" label="Accident" />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            4 actions. <span className="text-danger-600">Instant help.</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {ACTIONS.map((a, i) => (
              <ActionCard key={i} a={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">
            Ready in <span className="text-danger-600">3 minutes</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={i}>
                <div className="w-12 h-12 mx-auto border rounded-full flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Your number stays private
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {PRIVACY_ITEMS.map((p, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle className="text-danger-600" />
                <div>
                  <h4 className="font-bold">{p.title}</h4>
                  <p className="text-sm text-gray-500">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* Floating Badge */
function FloatingBadge({ className, color, label }: any) {
  return (
    <div className={`absolute flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow ${className}`}>
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}

/* DATA */
const ACTIONS = [
  {
    icon: Car,
    title: "Report Wrong Parking",
    body: "Notify instantly.",
    iconBg: "bg-danger-600/10",
    iconColor: "text-danger-600",
  },
  {
    icon: Phone,
    title: "Call Owner",
    body: "Masked calling.",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: AlertTriangle,
    title: "Emergency",
    body: "Send alert fast.",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  {
    icon: MapPin,
    title: "Accident",
    body: "Share location.",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
];

const STEPS = [
  { title: "Buy sticker", body: "Get QR code" },
  { title: "Activate", body: "Fill details" },
  { title: "Stick it", body: "Ready to use" },
];

const PRIVACY_ITEMS = [
  { title: "Encrypted", body: "Secure storage" },
  { title: "Masked calls", body: "No number exposed" },
  { title: "Secure routing", body: "Safe messages" },
  { title: "Kill switch", body: "Disable anytime" },
];