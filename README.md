# QRAlert v2 — Smart Vehicle Emergency System

WhatsApp-first, masked calls, Supabase backend, Next.js 14 App Router.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL + Storage) |
| Communication | Twilio (WhatsApp → SMS fallback + Proxy masked calls) |
| Styling | Tailwind CSS |
| Forms | react-hook-form |
| HTTP | axios |

---

## Setup (15 minutes)

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) → Create project
2. In **SQL Editor** → run the full contents of `supabase-schema.sql`
3. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Twilio

1. Sign up at [twilio.com](https://twilio.com)
2. Get a phone number (supports SMS + Voice)
3. **For WhatsApp**: Go to **Messaging → Try it out → Send a WhatsApp message** to use the sandbox, OR apply for a WhatsApp Business sender
4. **For masked calls (optional but recommended)**:
   - Console → **Proxy** → Create a Service → copy the Service SID
5. Copy to your `.env.local`:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Phone number → `TWILIO_PHONE_NUMBER`
   - WhatsApp number → `TWILIO_WHATSAPP_NUMBER` (e.g. `whatsapp:+14155238886` for sandbox)
   - Proxy SID → `TWILIO_PROXY_SERVICE_SID` (optional)

### 3. Environment

```bash
cp .env.example .env.local
# Fill in all values
```

### 4. Install & run

```bash
npm install
npm run dev
```

---

## Routes

| URL | Description |
|---|---|
| `/` | Marketing homepage |
| `/activate/start` | Activation form (3-step wizard) |
| `/q/DEMO` | Demo scan page (no DB needed) |
| `/q/[code]` | Live scan page for any activated sticker |

---

## User Flows

### Owner (buys sticker)
1. Buys physical QRAlert sticker with printed code e.g. `QRA-4X7K`
2. Scans QR → lands on `/q/4X7K` → sees "not activated" → taps Activate
3. Fills 3-step form: personal info → vehicle details → enters `QRA-4X7K`
4. Submits → API validates code against DB → marks as `activated`
5. Sticker is now live

### Scanner (finds vehicle)
1. Scans sticker → `/q/4X7K`
2. Sees: owner first name, plate, vehicle details
3. Picks one of 4 actions:
   - **Wrong Parking** → optional photo + message → WhatsApp sent to owner
   - **Call Owner** → Twilio Proxy bridges call (numbers stay hidden)
   - **Emergency** → WhatsApp to owner + emergency contact
   - **Accident** → WhatsApp + GPS to owner, family, + SMS to ambulance

---

## Communication Flow (WhatsApp-first)

```
Scanner action
    │
    ▼
API Route (/api/action)
    │
    ├─ sendWhatsApp(owner_whatsapp, message)
    │       │
    │       ├─ Success → done
    │       └─ Fail    → sendSMS(owner_phone, message)  [fallback]
    │
    ├─ sendWhatsApp(emergency_contact_phone, message)   [if applicable]
    │
    └─ initiateMaskedCall() via Twilio Proxy             [call_owner action]
```

Real phone numbers **never leave the server**. The browser only receives `sticker_id` and public vehicle info.

---

## Adding sticker codes (production)

To create new sticker codes for physical stickers, insert rows into Supabase:

```sql
INSERT INTO public.stickers (activation_code, qr_code, status)
VALUES ('QRA-XXXX', 'XXXX', 'unactivated');
```

Or build a simple `/admin` route (not included — kept separate per spec) to generate batches.

The QR code printed on the sticker should encode:
```
https://yourdomain.com/q/XXXX
```

---

## Twilio Pricing (approx.)

| Service | Cost |
|---|---|
| WhatsApp message | ~$0.005 per message |
| SMS | ~$0.0079 per SMS (US), varies by country |
| Proxy masked call | ~$0.013/min + $0.01 session fee |
| Phone number | ~$1/month |

For Pakistan numbers: use Twilio's local Pakistani DID numbers for better deliverability.
