/**
 * Communication service — WhatsApp-first, SMS fallback, masked proxy calls.
 *
 * Flow:
 *  1. Every notification tries WhatsApp first (higher open rate, free for owner).
 *  2. If WhatsApp fails (e.g. user not on WA), falls back to regular SMS.
 *  3. Calls go through Twilio Proxy → neither party sees the real number.
 *
 * Twilio WhatsApp setup:
 *  - Dev/test: use the Twilio Sandbox (whatsapp:+14155238886)
 *  - Production: apply for a WhatsApp Business sender at console.twilio.com
 *
 * Twilio Proxy setup (masked calls):
 *  - console.twilio.com → Proxy → Create Service → copy the Service SID
 *  - Set TWILIO_PROXY_SERVICE_SID in your .env
 */

import twilio from "twilio";

const SID   = process.env.TWILIO_ACCOUNT_SID!;
const TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const FROM_SMS = process.env.TWILIO_PHONE_NUMBER!;          // +1234…
const FROM_WA  = process.env.TWILIO_WHATSAPP_NUMBER!;       // whatsapp:+1415…
const PROXY_SID = process.env.TWILIO_PROXY_SERVICE_SID;

function client() {
  return twilio(SID, TOKEN);
}

// ─── WhatsApp message (falls back to SMS) ─────────────────────────────────────
export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  const waDest = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  try {
    await client().messages.create({ from: FROM_WA, to: waDest, body });
    return true;
  } catch {
    // WhatsApp failed — try plain SMS
    try {
      await client().messages.create({ from: FROM_SMS, to, body });
      return true;
    } catch {
      return false;
    }
  }
}

// Convenience: send to multiple recipients, fire-and-forget failures
export async function sendToMany(numbers: (string | null | undefined)[], body: string) {
  const tasks = numbers.filter(Boolean).map((n) => sendWhatsApp(n!, body).catch(() => false));
  return Promise.allSettled(tasks);
}

// ─── Masked proxy call ────────────────────────────────────────────────────────
// Creates a Twilio Proxy session between scanner's number and owner's number.
// Neither party ever sees the other's real number — they both dial/receive
// a temporary Twilio proxy number.
export async function initiateMaskedCall(ownerPhone: string, scannerPhone: string) {
  if (!PROXY_SID) {
    // Fallback: outbound TwiML call to owner (scanner number stays hidden,
    // owner sees Twilio number). Less ideal but works without Proxy.
    const call = await client().calls.create({
      to: ownerPhone,
      from: FROM_SMS,
      twiml: `<Response>
        <Say voice="alice" language="en-US">
          You have a message from QRAlert about your vehicle.
          Someone scanned your sticker and wants to reach you.
          Please stay on the line.
        </Say>
        <Pause length="1"/>
      </Response>`,
    });
    return { mode: "outbound", callSid: call.sid };
  }

  // Full proxy session
  const session = await client()
    .proxy.v1.services(PROXY_SID)
    .sessions.create({
      uniqueName: `qra-${Date.now()}`,
      ttl: 3600, // session expires in 1 hour
    });

  await client()
    .proxy.v1.services(PROXY_SID)
    .sessions(session.sid)
    .participants.create({ identifier: ownerPhone });

  await client()
    .proxy.v1.services(PROXY_SID)
    .sessions(session.sid)
    .participants.create({ identifier: scannerPhone });

  return { mode: "proxy", sessionSid: session.sid };
}

// ─── Message templates ────────────────────────────────────────────────────────
export const msg = {
  wrongParking(plate: string, note: string) {
    return `🚗 *QRAlert — Wrong Parking Notice*\n\nYour vehicle *(${plate})* has been flagged for incorrect parking.\n\n📝 "${note}"\n\nPlease move your vehicle as soon as possible to avoid a fine or towing.\n\n_This message was sent via QRAlert._`;
  },

  emergencyOwner(plate: string, note: string) {
    return `🚨 *QRAlert — EMERGENCY ALERT*\n\nSomeone has reported an emergency involving your vehicle *(${plate})*.\n\n📝 "${note}"\n\n⚡ Please respond immediately.\n\n_QRAlert Emergency System_`;
  },

  emergencyContact(ownerName: string, plate: string, note: string) {
    return `🚨 *QRAlert — Emergency Involving ${ownerName}*\n\nAn emergency has been reported for vehicle *(${plate})*.\n\n📝 "${note}"\n\nPlease check on ${ownerName} immediately.\n\n_QRAlert Emergency System_`;
  },

  accidentOwner(plate: string) {
    return `🆘 *QRAlert — ACCIDENT ALERT*\n\nAn accident concern has been reported for your vehicle *(${plate})*.\n\nEmergency services may have been contacted. Please respond immediately.\n\n_QRAlert Emergency System_`;
  },

  accidentContact(ownerName: string, plate: string, location?: string) {
    return `🆘 *QRAlert — ACCIDENT: ${ownerName}*\n\nAn accident has been reported for *(${plate})*.\n${location ? `\n📍 Location: ${location}` : ""}\n\nPlease contact ${ownerName} or emergency services immediately.\n\n_QRAlert Emergency System_`;
  },

  ambulance(plate: string, color: string, type: string, location: string) {
    return `[QRAlert ACCIDENT REPORT]\nVehicle: ${color} ${type} | Plate: ${plate}\n📍 GPS: ${location}\nResponder needed — reported via QR tag.`;
  },
};
