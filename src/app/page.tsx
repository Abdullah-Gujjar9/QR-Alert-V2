import Link from "next/link";
import { ShieldAlert, QrCode, Phone, AlertTriangle, MapPin, MessageSquare, Car, Bike, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-600 text-white">
              <ShieldAlert size={17} />
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

      {/* 4 actions */}
      <section className="py-20 border-b border-ink-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-danger-600 mb-3">What scanners can do</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">4 actions. Instant help.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ACTIONS.map((a) => (
              <div key={a.title} className={`rounded-2xl p-6 border-2 ${a.border}`}>
                <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${a.iconBg}`}>
                  <a.icon size={22} className={a.iconColor} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-950 mb-2">{a.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-ink-50 border-b border-ink-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-danger-600 mb-3">Setup</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">Ready in 3 minutes</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-950 text-white font-display font-bold text-lg">{i + 1}</div>
                <h3 className="font-semibold text-ink-900 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 border-b border-ink-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl bg-ink-950 text-white p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">Privacy & Security</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Your number stays private. Always.</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRIVACY.map((p) => (
                <div key={p} className="flex items-start gap-3 text-sm text-ink-300">
                  <CheckCircle size={16} className="text-brand-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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

      <footer className="border-t border-ink-100 py-8 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} QRAlert · All contacts protected via Twilio masked communication
      </footer>
    </div>
  );
}

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

const PRIVACY = [
  "Phone numbers are stored encrypted in the database",
  "Scanners never see your real phone number",
  "All calls are bridged through Twilio Proxy masked numbers",
  "WhatsApp messages sent from QRAlert — not from your number",
  "Action audit log for every scan and alert",
  "Sticker can be suspended instantly if lost or stolen",
];
