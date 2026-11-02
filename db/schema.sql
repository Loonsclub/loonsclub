-- Run once against your database (Supabase or Neon): npm run db:setup
-- Safe to re-run.

create table if not exists enrollments (
  id           bigserial primary key,
  order_id     text not null unique,
  student_name text not null,
  parent_name  text not null,
  email        text not null,
  phone        text not null,
  school       text not null,
  grade        text not null,
  program      text,
  created_at   timestamptz not null default now()
);

create table if not exists partner_enquiries (
  id             bigserial primary key,
  school_name    text not null,
  principal_name text not null,
  email          text not null,
  phone          text not null,
  interests      text[] not null default '{}',
  created_at     timestamptz not null default now()
);

-- Set when an admin marks the enrollment as converted; null means it's on hold
alter table enrollments add column if not exists converted_at timestamptz;

create index if not exists enrollments_created_at_idx on enrollments (created_at desc);
create index if not exists partner_enquiries_created_at_idx on partner_enquiries (created_at desc);

-- Supabase exposes tables in "public" through its REST API. With RLS on and no policies, that API
-- can't read these tables; the app's direct connection (table owner) is unaffected. Harmless on Neon.
alter table enrollments enable row level security;
alter table partner_enquiries enable row level security;
