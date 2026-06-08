-- ============================================================
-- QRAlert Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Stickers table ────────────────────────────────────────────────────────────
create table if not exists public.stickers (
  id                      uuid primary key default gen_random_uuid(),
  activation_code         text unique not null,   -- e.g. "QRA-4X7K" printed on sticker
  qr_code                 text unique not null,   -- URL slug  e.g. "4X7K"
  status                  text not null default 'unactivated'
                            check (status in ('unactivated','activated','suspended')),
  created_at              timestamptz not null default now(),
  activated_at            timestamptz,

  -- Owner info (never exposed publicly)
  owner_first_name        text,
  owner_last_name         text,
  owner_phone             text,        -- E.164, encrypted at rest via Supabase Vault ideally
  owner_whatsapp          text,        -- E.164
  emergency_contact_name  text,
  emergency_contact_phone text,        -- E.164

  -- Vehicle info (some shown publicly on scan)
  plate_number            text,
  vehicle_type            text,        -- Car | Bike | Truck | Van | Other
  vehicle_make            text,
  vehicle_model           text,
  vehicle_color           text,
  vehicle_year            text,
  note                    text,        -- owner's custom message shown on scan page

  scan_count              integer not null default 0
);

-- ── Actions audit log ─────────────────────────────────────────────────────────
create table if not exists public.actions (
  id              uuid primary key default gen_random_uuid(),
  sticker_id      uuid not null references public.stickers(id) on delete cascade,
  action_type     text not null
                    check (action_type in ('wrong_parking','call_owner','emergency','accident')),
  message         text,
  latitude        double precision,
  longitude       double precision,
  image_path      text,   -- Supabase Storage path of attached image
  wa_sent         boolean default false,
  sms_sent        boolean default false,
  call_initiated  boolean default false,
  created_at      timestamptz not null default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- Stickers: public can read only safe columns via a view (see below).
-- All writes go through service-role API routes (bypass RLS).
alter table public.stickers enable row level security;
alter table public.actions  enable row level security;

-- No public SELECT on stickers — API routes use service-role key
create policy "deny_public_sticker_select" on public.stickers
  for select using (false);

create policy "deny_public_action_select" on public.actions
  for select using (false);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_stickers_qr_code         on public.stickers(qr_code);
create index if not exists idx_stickers_activation_code on public.stickers(activation_code);
create index if not exists idx_actions_sticker_id       on public.actions(sticker_id);

-- ── Supabase Storage bucket for action images ─────────────────────────────────
-- Run in Dashboard → Storage → New Bucket (or via SQL):
insert into storage.buckets (id, name, public)
  values ('action-images', 'action-images', false)
  on conflict do nothing;

-- ── Seed a few test stickers (remove in production) ──────────────────────────
insert into public.stickers (activation_code, qr_code, status)
values
  ('QRA-DEMO1', 'DEMO1', 'unactivated'),
  ('QRA-DEMO2', 'DEMO2', 'unactivated'),
  ('QRA-DEMO3', 'DEMO3', 'unactivated'),
  ('QRA-TEST1', 'TEST1', 'unactivated')
on conflict do nothing;
