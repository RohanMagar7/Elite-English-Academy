-- ============================================================================
-- Elite's English Academy — Supabase Schema
-- Run this in the Supabase SQL Editor (or via the CLI) to create all tables,
-- storage buckets, and RLS policies used by the website + admin panel.
-- Tables marked [existing] already existed; the script uses CREATE TABLE IF NOT
-- EXISTS so it can be run safely on an existing project.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- COURSES  [existing]
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration text,
  fees numeric,
  description text,
  eligibility text,
  mode text,
  image_url text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- GALLERY  [existing]
-- ---------------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- NOTICES  [existing]
-- ---------------------------------------------------------------------------
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text default 'General',
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS  [existing]
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course text,
  message text not null,
  rating int default 5,
  avatar text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ADMISSIONS  [existing]  (preferred_batch added)
-- ---------------------------------------------------------------------------
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_name text,
  phone text not null,
  email text,
  class_name text,
  course text,
  preferred_batch text,
  message text,
  status text default 'New',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CONTACTS  [existing]
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  subject text,
  message text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- BATCHES  [new]
-- ---------------------------------------------------------------------------
create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  time text not null,
  days text,
  level text,
  mode text,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- FAQS  [new]
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SUCCESS STORIES  [new]
-- ---------------------------------------------------------------------------
create table if not exists public.success_stories (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  course text not null,
  before_result text,
  after_result text,
  achievement text,
  badge text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TRAINERS  [new]
-- ---------------------------------------------------------------------------
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  qualification text not null,
  experience text,
  specialization text,
  role text,
  photo_url text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SETTINGS  [new]  — key/value store for site-wide configuration
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Public read access so the website can display content without auth.
alter table public.courses enable row level security;
alter table public.gallery enable row level security;
alter table public.notices enable row level security;
alter table public.testimonials enable row level security;
alter table public.batches enable row level security;
alter table public.faqs enable row level security;
alter table public.success_stories enable row level security;
alter table public.trainers enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses" on public.courses for select using (true);
drop policy if exists "Public read gallery" on public.gallery;
create policy "Public read gallery" on public.gallery for select using (true);
drop policy if exists "Public read notices" on public.notices;
create policy "Public read notices" on public.notices for select using (true);
drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials for select using (true);
drop policy if exists "Public read batches" on public.batches;
create policy "Public read batches" on public.batches for select using (true);
drop policy if exists "Public read faqs" on public.faqs;
create policy "Public read faqs" on public.faqs for select using (true);
drop policy if exists "Public read success_stories" on public.success_stories;
create policy "Public read success_stories" on public.success_stories for select using (true);
drop policy if exists "Public read trainers" on public.trainers;
create policy "Public read trainers" on public.trainers for select using (true);
drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings" on public.settings for select using (true);

-- Allow public inserts for enquiry forms and reviews.
drop policy if exists "Public insert admissions" on public.admissions;
create policy "Public insert admissions" on public.admissions for insert with check (true);
drop policy if exists "Public insert contacts" on public.contacts;
create policy "Public insert contacts" on public.contacts for insert with check (true);
drop policy if exists "Public insert testimonials" on public.testimonials;
create policy "Public insert testimonials" on public.testimonials for insert with check (true);

-- NOTE: Authenticated (admin) write access for all content tables.
-- Create one "Elite Admin" Supabase role user and attach these policies to it,
-- or enable these for the authenticated role:
-- create policy "Admin manage courses" on public.courses for all to authenticated using (true) with check (true);
-- (repeat for gallery, notices, testimonials, admissions, contacts, batches,
--  faqs, success_stories, trainers, settings)

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('courses', 'courses', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('trainers', 'trainers', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
);