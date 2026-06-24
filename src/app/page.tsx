"use client"; 
import React from "react";
import { ShieldAlert, QrCode, Phone, AlertTriangle, MapPin, Car, Bike, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import ActionCard from "@/components/ui/ActionCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-danger-500 selection:text-white">
      
      {/* NAVBAR */}
<div className="fixed top-4 left-0 z-50 w-full px-4 sm:px-6">
  <header className="mx-auto max-w-6xl rounded-full border border-ink-200/60 bg-white/70 px-6 py-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
    <div className="flex items-center justify-between relative">
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 group cursor-pointer">
  <img
    src="/logo.png"
    alt="SafePark"
    className="h-9 w-9 object-contain group-hover:scale-105 transition-transform"
  />
  <span className="font-display text-xl font-black tracking-tight text-ink-950">
    Safe<span className="text-danger-600">Park</span>
  </span>
</div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink-600 absolute left-1/2 -translate-x-1/2">
        <a href="#features" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">Features</a>
        <a href="#how-it-works" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">How It Works</a>
        <a href="#privacy" className="hover:text-danger-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-danger-600 after:transition-all">Privacy</a>
      </nav>

      {/* Button */}
      <Link href="/activate/new" className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-danger-600 hover:shadow-lg hover:shadow-danger-600/20 transition-all active:scale-95">
        Activate sticker <ArrowRight size={13} />
      </Link>

    </div>
  </header>
</div>

      {/*  HERO SECTION  */}
 <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white pt-24 pb-28 md:pt-20 md:pb-32">
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* TWO COLUMN RESPONSIVE GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT COLUMN:  */}
            <div className="lg:col-span-7 space-y-6 self-center">
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                One sticker.<br /><span className="text-danger-500">Every emergency</span><br />handled.
              </h1>
              <p className="text-base sm:text-lg text-ink-400 leading-relaxed max-w-xl">
                Stick QRAlert on your car or bike. Anyone who scans it can reach you securely wrong parking, accidents, emergencies without ever seeing your real number.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/activate/new" className="inline-flex items-center gap-2 rounded-2xl bg-danger-600 px-6 py-3.5 text-base font-bold text-white hover:bg-danger-700 transition-colors shadow-lg shadow-danger-600/30 active:scale-95">
                   Activate my sticker
                </Link>
                <Link href="/q/DEMO" className="inline-flex items-center gap-2 rounded-2xl border border-ink-700 px-6 py-3.5 text-base font-semibold text-white hover:bg-ink-800 transition-colors active:scale-95">
                  See demo scan
                </Link>
              </div>
            </div>

            {/*  RIGHT COLUMN  */}
<div className="hidden lg:flex lg:col-span-5 items-center justify-center relative w-full h-[440px]">
  <div className="absolute w-64 h-64 bg-danger-600/20 blur-3xl rounded-full pointer-events-none" />
  <div
    className="relative z-10"
    style={{
      padding: '3px',
      borderRadius: '18px',
      background: 'linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 35%, #b91c1c 75%, #dc2626 100%)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(220,38,38,0.12)',
    }}
  >
    <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>

      {/* QR Image */}
      <div style={{ padding: '20px 20px 16px 20px', background: '#fff' }}>
        <img
          src="/qr-sticker.png"
          alt="QRAlert sticker"
          style={{
            width: '180px',
            height: '180px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* SCAN TO CONNECT bottom bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 55%, #dc2626 100%)',
          padding: '11px 20px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
          }}
        >
          SCAN TO CONNECT
        </span>
      </div>

    </div>
  </div>

</div>
{/* ALL BADGES DISABLED BY TEAM LEAD (Commented Out below) */}
  {/*

              // FLOATING BADGE Wrong Parking 
              <div className="absolute top-20 left-0 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:4s] select-none">               
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Report Wrong Parking</span>
              </div>

              // FLOATING BADGE  masked phone Calling 
              <div className="absolute top-20 -right-0 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:4.6s] select-none">
                
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Call Owner (Masked)</span>
              </div>

              // FLOATING BADGE emergency Trigger 
              <div className="absolute bottom-20 -left-0 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:5.2s] select-none">
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Report Emergency</span>
              </div>

              // FLOATING BADGE accident concern 
              <div className="absolute bottom-20 right-2 z-20 flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 shadow-[0_12px_24px_rgba(0,0,0,0.15)] rounded-xl animate-bounce [animation-duration:5.8s] select-none">
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Accident Concern</span>
              </div>
*/}
            </div>
          </div>
          <div>
        </div>
      </section>
      {/* 4 ACTIONS SECTION */}
      <section id="features" className="py-20 border-b border-ink-100 scroll-mt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">What scanners can do</p>
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
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-3">Setup</p>
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
                    <div className="flex sm:hidden flex-col items-center py-3">
                      <div className="h-8 border-l-[1.5px] border-dashed border-ink-200" />
                    </div>
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

{/* PRIVACY SECTION */}
<section id="privacy" className="py-20 border-b border-ink-100 scroll-mt-24">
  <div className="mx-auto max-w-5xl px-4 sm:px-6">
    
    <div className="text-center mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-950/60 mb-3">
        Privacy & Security
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
        Your number stays private. <span className="text-danger-600">Always.</span>
      </h2>
    </div>

    <div className="relative rounded-2xl p-8 sm:p-12 shadow-sm overflow-hidden group transition-all duration-500 ease-out
      bg-danger-50/40 border border-danger-200">

      <div className="pointer-events-none absolute -inset-px rounded-2xl 
        opacity-100
        bg-[radial-gradient(400px_circle_at_center,rgba(185,28,28,0.10),transparent_80%)]" />
      
      <div className="relative z-10 grid gap-6 sm:grid-cols-2">
        {PRIVACY_ITEMS.map((p: { title: string; body: string }, idx: number) => (   
          <div key={idx} className="flex items-start gap-4 group/item cursor-default transition-all duration-300 md:hover:-translate-y-1">
            <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5 md:group-hover/item:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-semibold text-ink-950 text-base mb-1 md:group-hover/item:text-danger-700 transition-colors duration-300">
                {p.title}
              </h4>
              <p className="text-ink-500 text-sm leading-relaxed md:group-hover/item:text-ink-800 transition-colors duration-300">
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
<section
  className="relative overflow-hidden py-24 text-center border-t border-zinc-100"
  style={{
    background: 'radial-gradient(ellipse 90% 70% at 50% 0%, #ffebeb 0%, #fff6f6 50%, #ffffff 100%)'
  }}
>
  <div
    className="pointer-events-none absolute left-1/2 top-[-60px] h-[300px] w-[600px] -translate-x-1/2"
    style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 70%)' }}
  />

  <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6">

    <h2 className="font-display mb-5 text-4xl font-bold leading-[1.12] tracking-tight text-zinc-950 sm:text-5xl">
      Protect your vehicle.<br />
      <span className="text-danger-600">Starting today.</span>
    </h2>

    <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-zinc-500">
      Buy a Safe Park sticker, activate it in 3 minutes, and every emergency is handled anonymously.
    </p>

    <div className="flex justify-center">
      <Link
        href="/activate/new"
        className="inline-flex items-center justify-center rounded-[14px] bg-danger-600 px-8 py-4 text-[15px] font-bold text-white transition-all shadow-lg shadow-danger-600/20 active:scale-95"
      >
        Activate my sticker
      </Link>
    </div>
  </div>
</section>

{/* DIVIDER */}
<div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #fecaca 30%, #fecaca 70%, transparent)' }} />

{/* Footer*/}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-4 pb-8 pt-14 sm:px-6 text-zinc-400">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 border-b border-zinc-900 pb-11 md:grid-cols-4">

            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
  <div className="flex items-center gap-2.5">
    <img
      src="logo.png"
      alt="SafePark"
      className="h-[34px] w-[34px] object-contain"
    />
    <span className="font-display text-lg font-black text-white">
      Safe<span className="text-danger-600">Park</span>
    </span>
  </div>
              <p className="max-w-[230px] text-[13px] leading-relaxed text-zinc-500">
                Securing Pakistani roads with smart masked communication. Your number stays private always.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">Navigation</h4>
              <ul className="space-y-2.5 text-[13px]">
                {[["#features", "Key Features"], ["#how-it-works", "How It Works"], ["#privacy", "Privacy Logs"]].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="text-zinc-400 hover:text-danger-500 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">Legal</h4>
              <ul className="space-y-2.5 text-[13px]">
                <li><Link href="/privacy" className="text-zinc-400 hover:text-danger-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-zinc-400 hover:text-danger-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 pt-7 sm:flex-row">
            <div className="space-y-1 text-center text-[12px] text-zinc-500 sm:text-left">
              <p>© {new Date().getFullYear()} SafePark Inc. All rights reserved.</p>
              <p>All contacts protected via Twilio masked communication.</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="h-[5px] w-[5px] rounded-full bg-green-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
// Constant arrays remain unchanged
const ACTIONS = [
  { icon: Car, title: "Report Wrong Parking", body: "Attach a photo and notify the owner via WhatsApp instantly no number shared.", border: "border-amber-200", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { icon: Phone, title: "Call the Owner", body: "One-tap masked call through Twilio Proxy  neither party's real number is ever exposed.", border: "border-brand-200", iconBg: "bg-brand-50", iconColor: "text-brand-600" },
  { icon: AlertTriangle, title: "Report Emergency", body: "Send an emergency WhatsApp + photo to the owner and their emergency contact at once.", border: "border-danger-200", iconBg: "bg-danger-50", iconColor: "text-danger-600" },
  { icon: MapPin, title: "Accident Concern", body: "Share GPS location with emergency services, alert family, and attach accident photo.", border: "border-ink-200", iconBg: "bg-ink-100", iconColor: "text-ink-700" },
];

const STEPS = [
  { title: "Buy a sticker", body: "Get a QRAlert sticker with a unique activation code printed on it." },
  { title: "Scan & activate", body: "Scan the QR, fill in your vehicle and contact details, submit." },
  { title: "Stick it on", body: "Attach to your car or bike. Anyone who scans it can help instantly." },
];

const PRIVACY_ITEMS = [
  { title: "Encrypted Database", body: "Phone numbers are stored completely encrypted inside our secure system database." },
  { title: "100% Anonymity", body: "Scanners never see your real phone number absolute privacy guaranteed." },
  { title: "Masked Phone Calls", body: "All calls are safely bridged through Twilio Proxy masked communication lines." },
  { title: "Secure Routing", body: "WhatsApp messages are sent directly from QRAlert, keeping your phone hidden." },
  { title: "Full Audit Logs", body: "A real-time action audit log tracks every single scan and alert instantly." },
  { title: "Instant Kill-Switch", body: "Your vehicle sticker can be suspended or deleted instantly if lost or stolen." },
];