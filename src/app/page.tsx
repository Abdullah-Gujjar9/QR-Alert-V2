"use client"; 
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform ,useMotionTemplate } from "framer-motion";
import Link from "next/link";
import ActionCard from "@/components/ui/ActionCard";
import { ShieldAlert, QrCode, Phone, AlertTriangle, MapPin, Car, Bike, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-danger-500 selection:text-white">
      
      {/*   NAVBAR */}
      <div className="fixed top-4 left-0 z-50 w-full px-4 sm:px-6">
        <header className="mx-auto max-w-5xl rounded-full border border-ink-200/60 bg-white/70 px-6 py-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex items-center justify-between">
            
            {/* Left Side: Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-600 text-white shadow-md shadow-danger-600/20 group-hover:scale-105 transition-transform">
                <ShieldAlert size={19} />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-ink-950">
                QR<span className="text-danger-600">Alert</span>
              </span>
            </div>

            {/*  Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink-600">
              <a href="#features" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">Features</a>
              <a href="#how-it-works" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">How It Works</a>
              <a href="#privacy" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">Privacy</a>
            </nav>

            {/*  Action Button */}
            <div>
              <Link href="/activate/new" className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-danger-600 hover:shadow-lg hover:shadow-danger-600/20 transition-all active:scale-95">
                Activate sticker <ArrowRight size={13} />
              </Link>
            </div>
            <span className="font-display text-lg font-bold text-ink-950">QR<span className="text-danger-600">Alert</span></span>
          </div>
          <Link href="/activate/new" className="inline-flex items-center gap-1.5 rounded-xl bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 transition-colors">
            Activate sticker <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-danger-600/40 bg-danger-600/10 px-4 py-1.5 text-sm font-semibold text-danger-400 mb-6">
            <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" />
            Pakistan's First Smart Vehicle Tag
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            One sticker.<br /><span className="text-danger-500">Every emergency</span><br />handled.
          </h1>
          <p className="text-lg sm:text-xl text-ink-400 leading-relaxed mb-10 max-w-xl">
            Stick QRAlert on your car or bike. Anyone who scans it can reach you securely — wrong parking, accidents, emergencies — without ever seeing your real number.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/activate/new" className="inline-flex items-center gap-2 rounded-2xl bg-danger-600 px-7 py-4 text-base font-bold text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30">
              <QrCode size={20} /> Activate my sticker
            </Link>
            <Link href="/q/DEMO" className="inline-flex items-center gap-2 rounded-2xl border border-ink-700 px-7 py-4 text-base font-semibold text-white hover:bg-ink-800 transition-colors">
              See demo scan
            </Link>
            <Link
              href="/activate/scan"
              className="inline-flex items-center gap-2 rounded-2xl border border-ink-700 px-7 py-4 text-base font-semibold text-white hover:bg-ink-800 transition-colors"
            >
              Scan QR
            </Link>
          </div>
        </div>
      </section>

    </div>
  </header>
</div>

      {/*  HERO SECTION  */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white pt-28 pb-20 md:pt-36 md:pb-32">
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* TWO COLUMN RESPONSIVE GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN:  */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-danger-600/40 bg-danger-600/10 px-4 py-1.5 text-sm font-semibold text-danger-400">
                <span className="h-2 w-2 rounded-full bg-danger-500 animate-pulse" />
                Pakistan's First Smart Vehicle Tag
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                One sticker.<br /><span className="text-danger-500">Every emergency</span><br />handled.
              </h1>
              <p className="text-base sm:text-lg text-ink-400 leading-relaxed max-w-xl">
                Stick QRAlert on your car or bike. Anyone who scans it can reach you securely — wrong parking, accidents, emergencies — without ever seeing your real number.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/activate/new" className="inline-flex items-center gap-2 rounded-2xl bg-danger-600 px-6 py-3.5 text-base font-bold text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30 active:scale-95">
                  <QrCode size={20} /> Activate my sticker
                </Link>
                <Link href="/q/DEMO" className="inline-flex items-center gap-2 rounded-2xl border border-ink-700 px-6 py-3.5 text-base font-semibold text-white hover:bg-ink-800 transition-colors active:scale-95">
                  See demo scan
                </Link>
              </div>
            </div>

            {/*  RIGHT COLUMN Vector QR aur 4 Floating Badges */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative w-full h-[440px]">

              <div className="absolute w-64 h-64 bg-danger-600/20 blur-3xl rounded-full pointer-events-none" />

              {/*  Vector SVG QR Code */}
              <div className="relative z-10 p-5 bg-white border border-neutral-200/90 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl w-44 h-44 flex items-center justify-center transition-transform duration-500 hover:scale-[1.02]">
                <div className="w-full h-full bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center p-2.5 relative">
                  
                  {/* Vector QR SVG Grid */}
                  <svg className="w-full h-full text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h6v6H3zM4.5 4.5h3v3h-3z" />
                    <path d="M15 3h6v6h-6zM16.5 4.5h3v3h-3z" />
                    <path d="M3 15h6v6H3zM4.5 16.5h3v3h-3z" />
                    <path d="M15 15h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
                    <path d="M11 5h1v2h-1zM11 9h2v1h-2zM5 11h2v2H5zM9 11h2v1H9zM13 12h2v2h-2z" />
                    <path d="M12 16h1v3h-1zM16 11h3v1h-3zM19 13h2v1h-2z" />
                  </svg>

                  {/* Mini Red Core Center Indicator */}
                  <div className="absolute w-7 h-7 rounded-md bg-danger-600 border-2 border-white shadow-sm flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* FLOATING BADGE Wrong Parking */}
              <div className="absolute top-12 left-0 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:4s] select-none">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Report Wrong Parking</span>
              </div>

              {/* FLOATING BADGE  masked phone Calling */}
              <div className="absolute top-20 -right-4 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:4.6s] select-none">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Call Owner (Masked)</span>
              </div>

              {/* FLOATING BADGE emergency Trigger */}
              <div className="absolute bottom-20 -left-6 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:5.2s] select-none">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Report Emergency</span>
              </div>

              {/* FLOATING BADGE accident concern */}
              <div className="absolute bottom-12 right-2 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:5.8s] select-none">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Accident Concern</span>
              </div>

            </div>

            <FloatingBadge className="left-0 top-12" color="bg-amber-500" label="Wrong Parking" />
            <FloatingBadge className="-right-4 top-20" color="bg-emerald-500" label="Call Owner" />
            <FloatingBadge className="-left-6 bottom-20" color="bg-rose-500" label="Emergency" />
            <FloatingBadge className="bottom-12 right-2" color="bg-blue-500" label="Accident" />
          </div>
          
        </div>
      </section>
  
{/* 4 ACTIONS SECTION */}
<section id="features" className="py-20 border-b border-ink-100 scroll-mt-24">
  <div className="mx-auto max-w-5xl px-4 sm:px-6">
    <div className="text-center mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
        What scanners can do
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
        4 actions. <span className="text-danger-600">Instant help.</span>
      </h2>
    </div>
    
    <div className="grid gap-4 sm:grid-cols-2">
      {ACTIONS.map((a, index) => (
        <ActionCard key={a.title} a={a} index={index} />
      ))}
    </div>
  </div>
</section>
  
{/* HOW IT WORKS SECTION */}
<section id="how-it-works" className="py-20 bg-ink-50 border-b border-ink-100 scroll-mt-24">
  <div className="mx-auto max-w-5xl px-4 sm:px-6">

    <div className="text-center mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-3">
        Setup
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950 tracking-tight">
        Ready in <span className="text-danger-600">3 minutes</span>
      </h2>
    </div>

    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center max-w-2xl mx-auto">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex-1 flex flex-col items-center text-center px-4 w-full sm:w-auto group cursor-default transition-transform duration-300 hover:-translate-y-1.5">
            <div className="mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-ink-950 text-ink-950 font-display font-bold text-base transition-all duration-300 group-hover:bg-danger-600 group-hover:border-danger-600 group-hover:text-white">
              {i + 1}
            </div>
            <h3 className="font-semibold text-ink-900 mb-2 transition-colors duration-300 group-hover:text-danger-600">
              {s.title}
            </h3>
            <p className="text-sm text-ink-500 max-w-[220px] sm:max-w-[160px]">{s.body}</p>
          </div>

          {i < STEPS.length - 1 && (
            <>
              {/* vertical   mobile  */}
              <div className="flex sm:hidden flex-col items-center py-3">
                <div className="h-8 border-l-[1.5px] border-dashed border-ink-200" />
              </div>
              {/* horizontal desktop  */}
              <div className="hidden sm:flex flex-none w-14 items-start pt-[22px]">
                <div className="w-full border-t-[1.5px] border-dashed border-ink-200" />
              </div>
            </>
          )}
        </React.Fragment>
      ))}
    </div>

  </div>
</section>
      {/* PRIVACY SECTION  */}
<section id="privacy" className="py-20 border-b border-ink-100 scroll-mt-24 bg-white">
  <div className="mx-auto max-w-5xl px-4 sm:px-6">
    <div className="text-center mb-16">
      <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-danger-700 bg-danger-50 border border-danger-100 rounded-full inline-block mb-4">
        Security Standard
      </span>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950 tracking-tight">
        Your number stays private. <span className="text-danger-600">Always.</span>
      </h2>
    </div>

    {/* Card */}
    <div className="relative rounded-2xl p-8 sm:p-12 bg-neutral-50/60 border border-danger-200/70 shadow-[0_4px_12px_rgba(220,38,38,0.01)] overflow-hidden">
      <div className="relative z-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {PRIVACY_ITEMS.map((p: { title: string; body: string }, idx: number) => (
          <div key={idx} className="flex items-start gap-4">
            
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-danger-100 shadow-sm mt-0.5">
              <CheckCircle 
                size={18} 
                className="text-danger-600" 
              />
            </div>
            
            <div>
              <h4 className="font-bold text-ink-950 text-base mb-1 tracking-tight">
                {p.title}
              </h4>
              <p className="text-ink-500 text-sm leading-relaxed font-normal">
                {p.body}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>

  </div>
</section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-4 mb-6 text-ink-300">
            <Car size={40} /> <Bike size={40} />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950 mb-4">Protect your vehicle today</h2>
          <p className="text-ink-500 mb-8">Buy a QRAlert sticker, scan it to activate, done.</p>
          <Link href="/activate/new" className="inline-flex items-center gap-2 rounded-2xl bg-danger-600 px-8 py-4 text-base font-bold text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30">
            <ShieldAlert size={20} /> Activate my sticker now
          </Link>
        </div>
      </section>

      {/*  FOOTER */}
<footer className="bg-ink-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-8">
  <div className="mx-auto max-w-5xl px-4 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
      
      {/* Brand Info */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger-600 text-white">
            <ShieldAlert size={15} />
          </div>
          <span className="font-display text-lg font-bold text-white">QR<span className="text-danger-500">Alert</span></span>
        </div>
        <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
          Securing Pakistani roads and vehicles with smart masked communication technology.
        </p>
      </div>

      {/*  Links */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#features" className="hover:text-white transition-colors">Key Features</a></li>
          <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
          <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Logs</a></li>
        </ul>
      </div>

      {/*  Support Legal */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Safe</h4>
        <ul className="space-y-2 text-sm">
          <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
        </ul>
      </div>

    </div>
    {/* Bottom Footer */}
    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
      <div className="space-y-1 text-center sm:text-left">
        <p>© {new Date().getFullYear()} QRAlert Inc. All rights reserved.</p>
        <p className="text-neutral-400 font-medium">
          All contacts protected via Twilio masked communication.
        </p>
      </div>
    </div>

  </div>
</footer>

    </div>
  );
}

// Constant arrays 
const ACTIONS = [
  { icon: Car, title: "Report Wrong Parking", body: "Attach a photo and notify the owner via WhatsApp instantly — no number shared.", border: "border-amber-200", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { icon: Phone, title: "Call the Owner", body: "One-tap masked call through Twilio Proxy — neither party's real number is ever exposed.", border: "border-brand-200", iconBg: "bg-brand-50", iconColor: "text-brand-600" },
  { icon: AlertTriangle, title: "Report Emergency", body: "Send an emergency WhatsApp + photo to the owner and their emergency contact at once.", border: "border-danger-200", iconBg: "bg-danger-50", iconColor: "text-danger-600" },
  { icon: MapPin, title: "Accident Concern", body: "Share GPS location with emergency services, alert family, and attach accident photo.", border: "border-ink-200", iconBg: "bg-ink-100", iconColor: "text-ink-700" },
];

const STEPS = [
  { title: "Buy a sticker", body: "Get a QRAlert sticker with a unique activation code printed on it." },
  { title: "Scan & activate", body: "Scan the QR, fill in your vehicle and contact details, submit." },
  { title: "Stick it on", body: "Attach to your car or bike. Anyone who scans it can help — instantly." },
];

const PRIVACY_ITEMS = [
  { title: "Encrypted Database", body: "Phone numbers are stored completely encrypted inside our secure system database." },
  { title: "100% Anonymity", body: "Scanners never see your real phone number — absolute privacy guaranteed." },
  { title: "Masked Phone Calls", body: "All calls are safely bridged through Twilio Proxy masked communication lines." },
  { title: "Secure Routing", body: "WhatsApp messages are sent directly from QRAlert, keeping your phone hidden." },
  { title: "Full Audit Logs", body: "A real-time action audit log tracks every single scan and alert instantly." },
  { title: "Instant Kill-Switch", body: "Your vehicle sticker can be suspended or deleted instantly if lost or stolen." },
];