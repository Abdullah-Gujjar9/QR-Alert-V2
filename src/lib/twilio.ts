/**
 * Twilio integration for masked calls & SMS.
 *
 * WHY TWILIO?
 *  - Number masking: both parties call a Twilio proxy number — neither sees
 *    the other's real number.
 *  - Programmable SMS: send templated messages on behalf of the platform.
 *  - Verified caller ID: recipients see "QRAlert" not a random number.
 *  - Competitive pricing: ~$0.013/min calls, ~$0.0079/SMS (US).
 *  - Alternatives: Vonage (similar pricing), Sinch (cheaper in Asia/ME).
 *
 * All real phone numbers stay server-side.  The browser never receives them.
 */

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken  = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;  // your Twilio number
const proxyServiceSid = process.env.TWILIO_PROXY_SID; // optional proxy service

function client() {
  return twilio(accountSid, authToken);
}

// ─── Send SMS ─────────────────────────────────────────────────────────────────
export async function sendSMS(to: string, body: string) {
  return client().messages.create({ from: fromNumber, to, body });
}

// ─── Initiate masked call via Twilio Proxy ────────────────────────────────────
// When proxyServiceSid is set, Twilio bridges scanner ↔ owner through a
// masked number.  Without it we fall back to a direct call via TwiML.
export async function initiateCall(toNumber: string, fromScanner: string) {
  if (proxyServiceSid) {
    // Create a proxy session — returns a masked number to call
    const session = await client()
      .proxy.v1.services(proxyServiceSid)
      .sessions.create({ uniqueName: `session-${Date.now()}`, ttl: 3600 });

    await client()
      .proxy.v1.services(proxyServiceSid)
      .sessions(session.sid)
      .participants.create({ identifier: toNumber });

    await client()
      .proxy.v1.services(proxyServiceSid)
      .sessions(session.sid)
      .participants.create({ identifier: fromScanner });

    return { sessionSid: session.sid };
  }

  // Fallback: outbound call — owner's phone rings, bridged through Twilio
  const call = await client().calls.create({
    to: toNumber,
    from: fromNumber,
    twiml: `<Response><Say voice="alice">You have an alert from QRAlert regarding your vehicle. Please hold.</Say><Pause length="2"/></Response>`,
  });
  return { callSid: call.sid };
}

// ─── SMS templates ────────────────────────────────────────────────────────────
export const smsTemplates = {
  wrongParking: (plate: string, msg: string) =>
    `[QRAlert] Your vehicle (${plate}) has been reported for wrong parking.\n\nMessage: "${msg}"\n\nPlease move your vehicle as soon as possible.`,

  emergency: (plate: string, msg: string) =>
    `[QRAlert] EMERGENCY reported for your vehicle (${plate}).\n\nDetails: "${msg}"\n\nPlease respond immediately or contact emergency services.`,

  accident: (name: string, plate: string) =>
    `[QRAlert] URGENT: An accident concern has been reported for ${name}'s vehicle (${plate}). Emergency services may have been notified. Please call back immediately.`,

  emergencyContactAlert: (ownerName: string, plate: string, msg: string) =>
    `[QRAlert] EMERGENCY ALERT: ${ownerName}'s vehicle (${plate}) has been flagged in an accident. Details: "${msg}". Please check on them immediately.`,
};
