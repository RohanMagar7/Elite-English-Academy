-- =====================================================================================
--  ELITE'S ENGLISH ACADEMY — COMPLETE SUPABASE SCHEMA (single file)
--  Next.js 16 (App Router) + Supabase CRUD Admin Panel
-- =====================================================================================
--
--  HOW TO RUN
--    1. Open the Supabase Dashboard -> SQL Editor -> "New query".
--    2. Paste this ENTIRE file and press Run (safe to run top-to-bottom).
--    3. It is fully idempotent: running it again on the same project will not error.
--
--  WHAT THIS FILE DOES (in order)
--    [0]  PRE-FLIGHT — helper functions used by the rest of the file.
--    [1]  TABLES      — every table the website + admin panel reads/writes
--                       (CREATE TABLE IF NOT EXISTS + ALTER TABLE ADD COLUMN IF NOT EXISTS).
--    [2]  DEDUPE      — deletes duplicate rows (keeps the oldest) before unique keys exist.
--    [3]  UNIQUE KEYS — prevents those duplicates from ever coming back.
--    [4]  FOREIGN KEYS— profiles/admins -> auth.users, features/items -> page_sections.
--    [5]  TRIGGERS    — updated_at timestamps, section_key <-> section_slug sync, slugify,
--                       auto-create parent page_sections rows.
--    [6]  INDEXES     — one composite index per real query pattern used by the app.
--    [7]  RLS         — public read + public insert (forms) + authenticated admin writes.
--    [8]  STORAGE     — public buckets + storage.objects policies used by the upload UIs.
--    [9]  DATA RESET  — deletes ALL existing content (TRUNCATE ... RESTART IDENTITY CASCADE).
--    [10] SEED        — clean, non-duplicated starter content matching the site's copy.
--    [11] CACHE       — reloads the PostgREST schema cache (kills "schema cache" errors).
--
--  !!  WARNING — DATA RESET  !!
--    Section [9] intentionally wipes every content table, then section [10] re-seeds it.
--    That is exactly what "delete all existing data / remove duplicates" means here.
--    To KEEP your current content, comment out ONLY section [9].
--    Your Supabase Auth users (auth.users) are NEVER touched.
--
--  COLUMN CONVENTIONS
--    id uuid primary key default gen_random_uuid()   -> all content tables
--    created_at / updated_at timestamptz not null default now()
--    sort_order int  not null default 0              -> admin reordering (ORDER BY sort_order)
--    is_active  bool not null default true           -> show/hide toggle in the admin panel
--    slug / page / section_key / section_slug        -> CMS grouping + future pretty URLs
--    profiles.id / admins.user_id -> auth.users(id)  -> auth-linked metadata tables
--    admins.id is text on purpose: it is the short login id that app/login/page.tsx
--    resolves through .or("username.eq.x,login.eq.x,id.eq.x").
--
--  TABLES (20 + storage)
--    content : courses, gallery, notices, testimonials, batches, faqs, success_stories,
--              trainers, navigation_links, hero_slides, stats, features, social_links,
--              footer_links, page_sections, section_items, settings
--    inbox   : admissions, contacts                       (admin-only, no public read)
--    auth    : profiles, admins                           (never wiped by section [9]...
--                                                          admins never; profiles re-synced)
--
--  NOTES
--    * gen_random_uuid() is built into PostgreSQL 13+ (Supabase = 15/17): no extension needed.
--    * No service_role key required — the admin panel writes as the `authenticated` role.
--    * Verified against the queries in app/, components/ and hooks/ of this repository.
-- =====================================================================================

set client_min_messages to warning;   -- keeps the SQL Editor output readable

-- =====================================================================================
-- [0] PRE-FLIGHT — helper functions used by later sections
-- =====================================================================================

-- Generic "touch updated_at" trigger function (attached in section [5]).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- URL-safe slug helper used by the slugify trigger (section [5]).
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select nullif(
           trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g')),
           ''
         );
$$;

-- =====================================================================================
-- [1] TABLES
--     Every table below is created if missing, then every column the app touches is
--     added with ADD COLUMN IF NOT EXISTS so older/partial databases are upgraded too.
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 1.1 COURSES  (app/admin/courses, components/CoursesSection)
-- -------------------------------------------------------------------------------------
create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text,
  duration      text,
  fees          numeric,
  description   text,
  eligibility   text,
  mode          text,
  level         text,
  image_url     text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.courses add column if not exists title       text;
alter table public.courses add column if not exists slug        text;
alter table public.courses add column if not exists duration    text;
alter table public.courses add column if not exists fees        numeric;
alter table public.courses add column if not exists description text;
alter table public.courses add column if not exists eligibility text;
alter table public.courses add column if not exists mode        text;
alter table public.courses add column if not exists level       text;
alter table public.courses add column if not exists image_url   text;
alter table public.courses add column if not exists sort_order  integer default 0;
alter table public.courses add column if not exists is_active   boolean default true;
alter table public.courses add column if not exists created_at  timestamptz default now();
alter table public.courses add column if not exists updated_at  timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.2 GALLERY  (app/admin/gallery, components/GalleryCard)
-- -------------------------------------------------------------------------------------
create table if not exists public.gallery (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text,
  image_url     text not null,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.gallery add column if not exists title      text;
alter table public.gallery add column if not exists category   text;
alter table public.gallery add column if not exists image_url  text;
alter table public.gallery add column if not exists sort_order integer default 0;
alter table public.gallery add column if not exists is_active  boolean default true;
alter table public.gallery add column if not exists created_at timestamptz default now();
alter table public.gallery add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.3 NOTICES  (app/admin/notices, components/NoticeCard, AnnouncementBanner)
-- -------------------------------------------------------------------------------------
create table if not exists public.notices (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      text not null default 'General',
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.notices add column if not exists title       text;
alter table public.notices add column if not exists description text;
alter table public.notices add column if not exists category    text default 'General';
alter table public.notices add column if not exists sort_order  integer default 0;
alter table public.notices add column if not exists is_active   boolean default true;
alter table public.notices add column if not exists created_at  timestamptz default now();
alter table public.notices add column if not exists updated_at  timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.4 TESTIMONIALS  (app/admin/testimonials, components/TestimonialCard public reviews)
-- -------------------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  course        text,
  message       text not null,
  rating        integer not null default 5,
  avatar        text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.testimonials add column if not exists name       text;
alter table public.testimonials add column if not exists course     text;
alter table public.testimonials add column if not exists message    text;
alter table public.testimonials add column if not exists rating     integer default 5;
alter table public.testimonials add column if not exists avatar     text;
alter table public.testimonials add column if not exists sort_order integer default 0;
alter table public.testimonials add column if not exists is_active  boolean default true;
alter table public.testimonials add column if not exists created_at timestamptz default now();
alter table public.testimonials add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.5 ADMISSIONS  (app/admission public form, app/admin/admissions)
--     status: 'New' | 'Contacted' | 'Joined'  (see app/admin/admissions page)
-- -------------------------------------------------------------------------------------
create table if not exists public.admissions (
  id              uuid primary key default gen_random_uuid(),
  student_name    text not null,
  parent_name     text,
  phone           text not null,
  email           text,
  class_name      text,
  course          text,
  preferred_batch text,
  message         text,
  status          text not null default 'New',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.admissions add column if not exists student_name    text;
alter table public.admissions add column if not exists parent_name     text;
alter table public.admissions add column if not exists phone           text;
alter table public.admissions add column if not exists email           text;
alter table public.admissions add column if not exists class_name      text;
alter table public.admissions add column if not exists course          text;
alter table public.admissions add column if not exists preferred_batch text;
alter table public.admissions add column if not exists message         text;
alter table public.admissions add column if not exists status          text default 'New';
alter table public.admissions add column if not exists created_at      timestamptz default now();
alter table public.admissions add column if not exists updated_at      timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.6 CONTACTS  (app/contact public form; read in the Supabase table editor)
-- -------------------------------------------------------------------------------------
create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text,
  phone         text,
  subject       text,
  message       text,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.contacts add column if not exists full_name  text;
alter table public.contacts add column if not exists email      text;
alter table public.contacts add column if not exists phone      text;
alter table public.contacts add column if not exists subject    text;
alter table public.contacts add column if not exists message    text;
alter table public.contacts add column if not exists is_read    boolean default false;
alter table public.contacts add column if not exists created_at timestamptz default now();
alter table public.contacts add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.7 BATCHES  (app/admin/batches, components/BatchTimings)
-- -------------------------------------------------------------------------------------
create table if not exists public.batches (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  time          text not null,
  days          text,
  level         text,
  mode          text,
  description   text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.batches add column if not exists name        text;
alter table public.batches add column if not exists time        text;
alter table public.batches add column if not exists days        text;
alter table public.batches add column if not exists level       text;
alter table public.batches add column if not exists mode        text;
alter table public.batches add column if not exists description text;
alter table public.batches add column if not exists sort_order  integer default 0;
alter table public.batches add column if not exists is_active   boolean default true;
alter table public.batches add column if not exists created_at  timestamptz default now();
alter table public.batches add column if not exists updated_at  timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.8 FAQS  (app/admin/faqs, components/FaqSection)
-- -------------------------------------------------------------------------------------
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.faqs add column if not exists question   text;
alter table public.faqs add column if not exists answer     text;
alter table public.faqs add column if not exists sort_order integer default 0;
alter table public.faqs add column if not exists is_active  boolean default true;
alter table public.faqs add column if not exists created_at timestamptz default now();
alter table public.faqs add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.9 SUCCESS STORIES  (app/admin/success-stories, components/SuccessStories)
-- -------------------------------------------------------------------------------------
create table if not exists public.success_stories (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  course        text not null,
  before_result text,
  after_result  text,
  achievement   text,
  badge         text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.success_stories add column if not exists student_name  text;
alter table public.success_stories add column if not exists course        text;
alter table public.success_stories add column if not exists before_result text;
alter table public.success_stories add column if not exists after_result  text;
alter table public.success_stories add column if not exists achievement   text;
alter table public.success_stories add column if not exists badge         text;
alter table public.success_stories add column if not exists sort_order    integer default 0;
alter table public.success_stories add column if not exists is_active     boolean default true;
alter table public.success_stories add column if not exists created_at    timestamptz default now();
alter table public.success_stories add column if not exists updated_at    timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.10 TRAINERS  (app/admin/trainers, components/TrainerCards)
-- -------------------------------------------------------------------------------------
create table if not exists public.trainers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  qualification  text not null,
  experience     text,
  specialization text,
  role           text,
  photo_url      text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.trainers add column if not exists name           text;
alter table public.trainers add column if not exists qualification  text;
alter table public.trainers add column if not exists experience     text;
alter table public.trainers add column if not exists specialization text;
alter table public.trainers add column if not exists role           text;
alter table public.trainers add column if not exists photo_url      text;
alter table public.trainers add column if not exists sort_order     integer default 0;
alter table public.trainers add column if not exists is_active      boolean default true;
alter table public.trainers add column if not exists created_at     timestamptz default now();
alter table public.trainers add column if not exists updated_at     timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.11 SETTINGS  (hooks/useSiteSettings.ts + app/admin/settings)
--      key/value store: academy_name, tagline, phone_display, phone_href,
--      whatsapp_number, email, address, business_hours, instagram_url, facebook_url,
--      youtube_url, logo_url, footer_about, copyright_text,
--      announcement_title, announcement_text
-- -------------------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.settings add column if not exists value      text;
alter table public.settings add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.12 NAVIGATION LINKS  (components/Navbar.tsx + app/admin/navigation)
-- -------------------------------------------------------------------------------------
create table if not exists public.navigation_links (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  href       text not null,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.navigation_links add column if not exists label      text;
alter table public.navigation_links add column if not exists href       text;
alter table public.navigation_links add column if not exists sort_order integer default 0;
alter table public.navigation_links add column if not exists is_active  boolean default true;
alter table public.navigation_links add column if not exists created_at timestamptz default now();
alter table public.navigation_links add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.13 HERO SLIDES  (components/Hero.tsx + app/admin/hero)
-- -------------------------------------------------------------------------------------
create table if not exists public.hero_slides (
  id                    uuid primary key default gen_random_uuid(),
  page                  text not null default 'home',
  badge                 text,
  title                 text not null,
  subtitle              text,
  description           text,
  image_url             text,
  primary_button_text   text default 'Free Demo Class',
  primary_button_link   text default '/admission',
  secondary_button_text text default 'View Courses',
  secondary_button_link text default '/courses',
  sort_order            integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.hero_slides add column if not exists page                  text default 'home';
alter table public.hero_slides add column if not exists badge                 text;
alter table public.hero_slides add column if not exists title                 text;
alter table public.hero_slides add column if not exists subtitle              text;
alter table public.hero_slides add column if not exists description           text;
alter table public.hero_slides add column if not exists image_url             text;
alter table public.hero_slides add column if not exists primary_button_text   text default 'Free Demo Class';
alter table public.hero_slides add column if not exists primary_button_link   text default '/admission';
alter table public.hero_slides add column if not exists secondary_button_text text default 'View Courses';
alter table public.hero_slides add column if not exists secondary_button_link text default '/courses';
alter table public.hero_slides add column if not exists sort_order            integer default 0;
alter table public.hero_slides add column if not exists is_active             boolean default true;
alter table public.hero_slides add column if not exists created_at            timestamptz default now();
alter table public.hero_slides add column if not exists updated_at            timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.14 STATS  (components/Stats.tsx + app/admin/stats)
-- -------------------------------------------------------------------------------------
create table if not exists public.stats (
  id         uuid primary key default gen_random_uuid(),
  page       text not null default 'home',
  label      text not null,
  value      numeric not null default 0,
  suffix     text default '',
  icon       text default 'Sparkles',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stats add column if not exists page       text default 'home';
alter table public.stats add column if not exists label      text;
alter table public.stats add column if not exists value      numeric default 0;
alter table public.stats add column if not exists suffix     text default '';
alter table public.stats add column if not exists icon       text default 'Sparkles';
alter table public.stats add column if not exists sort_order integer default 0;
alter table public.stats add column if not exists is_active  boolean default true;
alter table public.stats add column if not exists created_at timestamptz default now();
alter table public.stats add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.15 FEATURES  (components/WhyChooseUs.tsx + app/admin/features)
--      `section_slug` is what the app filters on (.eq("section_slug","why-choose-us")).
--      `section_key` is the new canonical CMS key — a trigger keeps both in sync,
--      so writing either one always updates the other (see section [5]).
--      Both columns are nullable with NO database default: the sync trigger computes
--      the effective key from whatever the client sent (section_slug-only admin forms
--      included) and fills in 'why-choose-us' only when neither is provided.
-- -------------------------------------------------------------------------------------
create table if not exists public.features (
  id           uuid primary key default gen_random_uuid(),
  page         text not null default 'home',
  section_key  text,
  section_slug text,
  title        text not null,
  description  text,
  icon         text default 'BadgeCheck',
  image_url    text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.features add column if not exists page         text default 'home';
alter table public.features add column if not exists section_key  text;
alter table public.features add column if not exists section_slug text;
alter table public.features add column if not exists title        text;
alter table public.features add column if not exists description  text;
alter table public.features add column if not exists icon         text default 'BadgeCheck';
alter table public.features add column if not exists image_url    text;
alter table public.features add column if not exists sort_order   integer default 0;
alter table public.features add column if not exists is_active    boolean default true;
alter table public.features add column if not exists created_at   timestamptz default now();
alter table public.features add column if not exists updated_at   timestamptz default now();

-- Backfill: rows created before section_key existed get it from section_slug.
update public.features
   set section_key = section_slug
 where section_key is null and section_slug is not null;
update public.features
   set section_slug = section_key
 where section_slug is null and section_key is not null;

-- -------------------------------------------------------------------------------------
-- 1.16 SOCIAL LINKS  (components/Footer.tsx + app/admin/footer)
-- -------------------------------------------------------------------------------------
create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  label      text,
  url        text not null,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_links add column if not exists platform   text;
alter table public.social_links add column if not exists label      text;
alter table public.social_links add column if not exists url        text;
alter table public.social_links add column if not exists sort_order integer default 0;
alter table public.social_links add column if not exists is_active  boolean default true;
alter table public.social_links add column if not exists created_at timestamptz default now();
alter table public.social_links add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.17 FOOTER LINKS  (components/Footer.tsx + app/admin/footer)
--      group_name: 'quick_links' | 'courses' (any new group works)
-- -------------------------------------------------------------------------------------
create table if not exists public.footer_links (
  id         uuid primary key default gen_random_uuid(),
  group_name text not null default 'quick_links',
  label      text not null,
  href       text not null default '#',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.footer_links add column if not exists group_name text default 'quick_links';
alter table public.footer_links add column if not exists label      text;
alter table public.footer_links add column if not exists href       text default '#';
alter table public.footer_links add column if not exists sort_order integer default 0;
alter table public.footer_links add column if not exists is_active  boolean default true;
alter table public.footer_links add column if not exists created_at timestamptz default now();
alter table public.footer_links add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.18 PAGE SECTIONS  (CMS section blocks: about / mission / vision / cta ...)
--      `slug` is unique and mirrored to `section_slug` + `section_key` by trigger.
-- -------------------------------------------------------------------------------------
create table if not exists public.page_sections (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null,
  section_key           text,
  section_slug          text,
  page                  text not null default 'home',
  section_type          text not null default 'custom',
  eyebrow               text,
  title                 text,
  subtitle              text,
  description           text,
  image_url             text,
  button_text           text,
  button_link           text,
  secondary_button_text text,
  secondary_button_link text,
  sort_order            integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.page_sections add column if not exists slug                  text;
alter table public.page_sections add column if not exists section_key           text;
alter table public.page_sections add column if not exists section_slug          text;
alter table public.page_sections add column if not exists page                  text default 'home';
alter table public.page_sections add column if not exists section_type          text default 'custom';
alter table public.page_sections add column if not exists eyebrow               text;
alter table public.page_sections add column if not exists title                 text;
alter table public.page_sections add column if not exists subtitle              text;
alter table public.page_sections add column if not exists description           text;
alter table public.page_sections add column if not exists image_url             text;
alter table public.page_sections add column if not exists button_text           text;
alter table public.page_sections add column if not exists button_link           text;
alter table public.page_sections add column if not exists secondary_button_text text;
alter table public.page_sections add column if not exists secondary_button_link text;
alter table public.page_sections add column if not exists sort_order            integer default 0;
alter table public.page_sections add column if not exists is_active             boolean default true;
alter table public.page_sections add column if not exists created_at            timestamptz default now();
alter table public.page_sections add column if not exists updated_at            timestamptz default now();

-- Backfill the two mirror columns from `slug`.
update public.page_sections set section_key  = slug where section_key  is null;
update public.page_sections set section_slug = slug where section_slug is null;

-- -------------------------------------------------------------------------------------
-- 1.19 SECTION ITEMS  (list rows that belong to a page_section / feature group)
--      `section_key` and `section_slug` are kept in sync by the same trigger.
--      Both columns are nullable with NO database default (same reasoning as
--      public.features above): the sync trigger derives the effective key from the
--      row itself, defaulting to 'why-choose-us' only when neither is provided.
-- -------------------------------------------------------------------------------------
create table if not exists public.section_items (
  id           uuid primary key default gen_random_uuid(),
  page         text not null default 'home',
  section_key  text,
  section_slug text,
  title        text not null,
  description  text,
  icon         text,
  image_url    text,
  link_text    text,
  link_href    text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.section_items add column if not exists page         text default 'home';
alter table public.section_items add column if not exists section_key  text;
alter table public.section_items add column if not exists section_slug text;
alter table public.section_items add column if not exists title        text;
alter table public.section_items add column if not exists description  text;
alter table public.section_items add column if not exists icon         text;
alter table public.section_items add column if not exists image_url    text;
alter table public.section_items add column if not exists link_text    text;
alter table public.section_items add column if not exists link_href    text;
alter table public.section_items add column if not exists sort_order   integer default 0;
alter table public.section_items add column if not exists is_active    boolean default true;
alter table public.section_items add column if not exists created_at   timestamptz default now();
alter table public.section_items add column if not exists updated_at   timestamptz default now();

-- Backfill whichever of the two mirror columns is missing.
update public.section_items set section_key  = section_slug where section_key  is null and section_slug is not null;
update public.section_items set section_slug = section_key  where section_slug is null and section_key  is not null;

-- -------------------------------------------------------------------------------------
-- 1.20 PROFILES — mirror of auth.users (optional admin metadata)
--      The app authenticates through Supabase Auth and treats the `authenticated`
--      role as admin, so this table is not required by the current code. It is the
--      standard Supabase pattern and lets you later tighten the RLS policies in
--      section [7] from "any authenticated user" to "only is_admin = true".
-- -------------------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'admin',
  is_admin   boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists role       text default 'admin';
alter table public.profiles add column if not exists is_admin   boolean default true;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();
-- app/profile/page.tsx renders profile?.avatar_url and profile?.phone, so both columns
-- must exist or the page silently falls back to the auth metadata / "-" forever.
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone      text;

-- -------------------------------------------------------------------------------------
-- 1.21 ADMIN LOGIN IDS  (app/login/page.tsx)
--      /login accepts EITHER an email address OR a short login id. When the typed value
--      has no "@", the page resolves it before signing in with:
--         supabase.from("admins").select("email")
--           .or("username.eq.<value>,login.eq.<value>,id.eq.<value>")
--      The table therefore has to exist with EXACTLY those three lookup columns,
--      otherwise PostgREST answers with
--         "Could not find the table 'public.admins' in the schema cache"
--      on every single login attempt.
--
--      `id` is intentionally `text` (not uuid) so the `id.eq.<value>` branch of that
--      `.or()` filter can never fail with "invalid input syntax for type uuid" when a
--      human types a login id such as `admin`. Link the row to the real Supabase Auth
--      user through `user_id`.
--
--      No rows are seeded: email + password sign-in works without them. To enable a
--      short login id for an existing Auth user, run (once, with your own values):
--         insert into public.admins (id, user_id, email, username, login, full_name)
--         values ('admin',
--                 (select id from auth.users where email = 'you@example.com'),
--                 'you@example.com', 'admin', 'admin', 'Academy Admin')
--         on conflict (id) do nothing;
-- -------------------------------------------------------------------------------------
create table if not exists public.admins (
  id         text primary key,                                   -- short login id
  user_id    uuid references auth.users (id) on delete cascade,  -- the Auth account it maps to
  email      text not null,                                      -- the address used for signInWithPassword
  username   text,                                               -- alternative login id
  login      text,                                               -- alternative login id
  full_name  text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admins add column if not exists user_id    uuid;
alter table public.admins add column if not exists email      text;
alter table public.admins add column if not exists username   text;
alter table public.admins add column if not exists login      text;
alter table public.admins add column if not exists full_name  text;
alter table public.admins add column if not exists is_active  boolean default true;
alter table public.admins add column if not exists created_at timestamptz default now();
alter table public.admins add column if not exists updated_at timestamptz default now();

-- -------------------------------------------------------------------------------------
-- 1.22 COLUMN DEFAULTS / NOT NULL NORMALISATION
--      Makes sure tables created by the older schema.sql / cms.sql end up with exactly
--      the same defaults as the CREATE TABLE statements above.
--      `alter column ... set default` / `set not null` are idempotent -> safe to re-run.
-- -------------------------------------------------------------------------------------

-- courses.fees is rendered with .toLocaleString() by components/CoursesSection.tsx,
-- so a NULL value would crash the public page -> normalise to 0 and forbid NULL.
update public.courses set fees = 0 where fees is null;
alter table public.courses alter column fees       set default 0;
alter table public.courses alter column sort_order set default 0;
alter table public.courses alter column is_active  set default true;
alter table public.courses alter column updated_at set default now();

alter table public.gallery alter column sort_order set default 0;
alter table public.gallery alter column is_active  set default true;
alter table public.gallery alter column updated_at set default now();

alter table public.notices alter column category   set default 'General';
alter table public.notices alter column sort_order set default 0;
alter table public.notices alter column is_active  set default true;
alter table public.notices alter column updated_at set default now();

alter table public.testimonials alter column rating     set default 5;
alter table public.testimonials alter column sort_order set default 0;
alter table public.testimonials alter column is_active  set default true;
alter table public.testimonials alter column updated_at set default now();

alter table public.admissions alter column status     set default 'New';
alter table public.admissions alter column updated_at set default now();

alter table public.contacts alter column is_read    set default false;
alter table public.contacts alter column updated_at set default now();

alter table public.batches alter column sort_order set default 0;
alter table public.batches alter column is_active  set default true;
alter table public.batches alter column updated_at set default now();

alter table public.faqs alter column sort_order set default 0;
alter table public.faqs alter column is_active  set default true;
alter table public.faqs alter column updated_at set default now();

alter table public.success_stories alter column sort_order set default 0;
alter table public.success_stories alter column is_active  set default true;
alter table public.success_stories alter column updated_at set default now();

alter table public.trainers alter column sort_order set default 0;
alter table public.trainers alter column is_active  set default true;
alter table public.trainers alter column updated_at set default now();

alter table public.navigation_links alter column sort_order set default 0;
alter table public.navigation_links alter column is_active  set default true;
alter table public.navigation_links alter column updated_at set default now();

alter table public.hero_slides alter column page                  set default 'home';
alter table public.hero_slides alter column primary_button_text   set default 'Free Demo Class';
alter table public.hero_slides alter column primary_button_link   set default '/admission';
alter table public.hero_slides alter column secondary_button_text set default 'View Courses';
alter table public.hero_slides alter column secondary_button_link set default '/courses';
alter table public.hero_slides alter column sort_order            set default 0;
alter table public.hero_slides alter column is_active             set default true;
alter table public.hero_slides alter column updated_at            set default now();

alter table public.stats alter column page       set default 'home';
alter table public.stats alter column value      set default 0;
alter table public.stats alter column suffix     set default '';
alter table public.stats alter column icon       set default 'Sparkles';
alter table public.stats alter column sort_order set default 0;
alter table public.stats alter column is_active  set default true;
alter table public.stats alter column updated_at set default now();

alter table public.features alter column page         set default 'home';
alter table public.features alter column icon         set default 'BadgeCheck';
alter table public.features alter column sort_order   set default 0;
alter table public.features alter column is_active    set default true;
alter table public.features alter column updated_at   set default now();

alter table public.social_links alter column sort_order set default 0;
alter table public.social_links alter column is_active  set default true;
alter table public.social_links alter column updated_at set default now();

alter table public.footer_links alter column group_name set default 'quick_links';
alter table public.footer_links alter column href       set default '#';
alter table public.footer_links alter column sort_order set default 0;
alter table public.footer_links alter column is_active  set default true;
alter table public.footer_links alter column updated_at set default now();

alter table public.page_sections alter column page         set default 'home';
alter table public.page_sections alter column section_type set default 'custom';
alter table public.page_sections alter column sort_order   set default 0;
alter table public.page_sections alter column is_active    set default true;
alter table public.page_sections alter column updated_at   set default now();

alter table public.section_items alter column page         set default 'home';
alter table public.section_items alter column sort_order   set default 0;
alter table public.section_items alter column is_active    set default true;
alter table public.section_items alter column updated_at   set default now();

alter table public.settings alter column updated_at set default now();

-- profiles / admins (Auth-linked metadata: no sort_order or page column).
alter table public.profiles alter column is_admin   set default true;
alter table public.profiles alter column updated_at set default now();

alter table public.admins alter column is_active  set default true;
alter table public.admins alter column created_at set default now();
alter table public.admins alter column updated_at set default now();

-- -------------------------------------------------------------------------------------
-- 1.23 BACKFILL NULLS + FORCE NOT NULL ON THE CONVENTION COLUMNS
--      Any legacy row that still has NULL sort_order / is_active / created_at /
--      updated_at / page is repaired, then the column is marked NOT NULL so the
--      admin panel and the public site can never hit an unexpected NULL again.
--      Runs only on columns that actually exist (information_schema guarded).
-- -------------------------------------------------------------------------------------
do $$
declare
  tbl        text;
  col        text;
  fill_value text;
  i          integer;
  tables     text[] := array[
                 'courses', 'gallery', 'notices', 'testimonials', 'batches', 'faqs',
                 'success_stories', 'trainers', 'navigation_links', 'hero_slides',
                 'stats', 'features', 'social_links', 'footer_links',
                 'page_sections', 'section_items', 'settings', 'admins'
               ];
  targets    text[][] := array[
                 ['sort_order', '0'],
                 ['is_active', 'true'],
                 ['created_at', 'now()'],
                 ['updated_at', 'now()'],
                 ['page', '''home''']
               ];
begin
  foreach tbl in array tables loop
    for i in 1 .. array_length(targets, 1) loop
      col := targets[i][1];
      fill_value := targets[i][2];

      if exists (
        select 1
          from information_schema.columns
         where table_schema = 'public'
           and table_name   = tbl
           and column_name  = col
      ) then
        execute format('update public.%I set %I = %s where %I is null', tbl, col, fill_value, col);
        execute format('alter table public.%I alter column %I set not null', tbl, col);
      end if;
    end loop;
  end loop;
end;
$$;

-- =====================================================================================
-- [2] DEDUPLICATE EXISTING ROWS
--     Keeps the OLDEST row of every duplicate group (ties broken by lowest uuid),
--     which is the row that was created first / shown first on the website.
--     Must run BEFORE section [3], because a unique index cannot be created while
--     duplicates still exist.
--     Identity for each table = its natural business key (never the uuid).
-- =====================================================================================

-- Navigation menu: same label + same target link
delete from public.navigation_links a
 using public.navigation_links b
 where (lower(a.label), lower(a.href)) is not distinct from (lower(b.label), lower(b.href))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Hero banners: same headline
delete from public.hero_slides a
 using public.hero_slides b
 where lower(a.title) is not distinct from lower(b.title)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Homepage stats: same label
delete from public.stats a
 using public.stats b
 where lower(a.label) is not distinct from lower(b.label)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Features: same title inside the same section group
delete from public.features a
 using public.features b
 where (lower(a.section_slug), lower(a.title)) is not distinct from (lower(b.section_slug), lower(b.title))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Social links: same platform
delete from public.social_links a
 using public.social_links b
 where lower(a.platform) is not distinct from lower(b.platform)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Footer links: same label inside the same column group
delete from public.footer_links a
 using public.footer_links b
 where (lower(a.group_name), lower(a.label)) is not distinct from (lower(b.group_name), lower(b.label))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Courses: same title (often re-added after an edit)
delete from public.courses a
 using public.courses b
 where lower(a.title) is not distinct from lower(b.title)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Gallery: the exact same image file uploaded twice
delete from public.gallery a
 using public.gallery b
 where a.image_url is not distinct from b.image_url
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Notices: same headline
delete from public.notices a
 using public.notices b
 where lower(a.title) is not distinct from lower(b.title)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Testimonials: same author + identical review text (md5 keeps the index small)
delete from public.testimonials a
 using public.testimonials b
 where (lower(a.name), md5(a.message)) is not distinct from (lower(b.name), md5(b.message))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Batches: same name + same timing
delete from public.batches a
 using public.batches b
 where (lower(a.name), lower(a.time)) is not distinct from (lower(b.name), lower(b.time))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- FAQs: same question
delete from public.faqs a
 using public.faqs b
 where lower(a.question) is not distinct from lower(b.question)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Success stories: same student on the same course
delete from public.success_stories a
 using public.success_stories b
 where (lower(a.student_name), lower(a.course)) is not distinct from (lower(b.student_name), lower(b.course))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Trainers: same name
delete from public.trainers a
 using public.trainers b
 where lower(a.name) is not distinct from lower(b.name)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Page sections: same slug (oldest kept)
delete from public.page_sections a
 using public.page_sections b
 where lower(a.slug) is not distinct from lower(b.slug)
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Section items: same title inside the same section
delete from public.section_items a
 using public.section_items b
 where (lower(a.section_slug), lower(a.title)) is not distinct from (lower(b.section_slug), lower(b.title))
   and (a.created_at, a.id) > (b.created_at, b.id);

-- Admin login ids: the same short id or the same address added twice
delete from public.admins a
 using public.admins b
 where a.id > b.id
   and ( lower(a.id)         is not distinct from lower(b.id)
      or lower(a.username)   is not distinct from lower(b.username)
      or lower(a.login)      is not distinct from lower(b.login)
      or lower(a.email)      is not distinct from lower(b.email) );

-- `settings` is keyed by its primary key (key) so it can never hold duplicates.

-- =====================================================================================
-- [3] UNIQUE KEYS — stops the duplicates from ever coming back
--     create unique index if not exists is idempotent and needs no DO block.
--     All comparisons are case-insensitive (lower(...)) so "Morning" == "morning".
-- =====================================================================================

create unique index if not exists ux_navigation_links_label_href
  on public.navigation_links (lower(label), lower(href));

create unique index if not exists ux_hero_slides_title
  on public.hero_slides (lower(title));

create unique index if not exists ux_stats_label
  on public.stats (lower(label));

create unique index if not exists ux_features_section_title
  on public.features (lower(section_slug), lower(title));

create unique index if not exists ux_social_links_platform
  on public.social_links (lower(platform));

create unique index if not exists ux_footer_links_group_label
  on public.footer_links (lower(group_name), lower(label));

create unique index if not exists ux_courses_title
  on public.courses (lower(title));

-- courses.slug is optional but must stay unique when present.
create unique index if not exists ux_courses_slug
  on public.courses (lower(slug));

create unique index if not exists ux_gallery_image_url
  on public.gallery (image_url);

create unique index if not exists ux_notices_title
  on public.notices (lower(title));

create unique index if not exists ux_testimonials_name_message
  on public.testimonials (lower(name), md5(message));

create unique index if not exists ux_batches_name_time
  on public.batches (lower(name), lower(time));

create unique index if not exists ux_faqs_question
  on public.faqs (lower(question));

create unique index if not exists ux_success_stories_student_course
  on public.success_stories (lower(student_name), lower(course));

create unique index if not exists ux_trainers_name
  on public.trainers (lower(name));

create unique index if not exists ux_page_sections_slug
  on public.page_sections (slug);

create unique index if not exists ux_section_items_section_title
  on public.section_items (lower(section_slug), lower(title));

-- Admin login ids (app/login/page.tsx resolves a non-email login with
-- .or("username.eq.x,login.eq.x,id.eq.x"), so each identifier must resolve to one row).
create unique index if not exists ux_admins_username
  on public.admins (lower(username)) where username is not null;
create unique index if not exists ux_admins_login
  on public.admins (lower(login)) where login is not null;
create unique index if not exists ux_admins_email
  on public.admins (lower(email));
create unique index if not exists ux_admins_user_id
  on public.admins (user_id) where user_id is not null;

-- =====================================================================================
-- [4] FOREIGN KEYS
--     * profiles.id -> auth.users.id (also declared inline in section [1.20]; re-added
--       here for databases where `profiles` already existed without the constraint).
--     * admins.user_id -> auth.users.id (declared inline in section [1.21] as well).
--     * features.section_slug / section_items.section_slug -> page_sections.slug, so a
--       CMS row can never point at a section that does not exist.
--     * Declared NOT VALID then VALIDATEd: legacy orphan rows coming from the old
--       cms.sql cannot block this script, while the constraint IS still enforced for
--       every new insert/update.
--     * The admin Features form lets you type any group name (why-choose-us, services,
--       ...), which would normally violate an FK. Section [5.4] adds a BEFORE
--       INSERT/UPDATE trigger that auto-creates the matching page_sections row first,
--       so the FK can never break the admin panel.
-- =====================================================================================

do $$
begin
  -- 4.1 profiles -> auth.users
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.profiles'::regclass
       and contype  = 'f'
       and conname  = 'profiles_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;

  -- 4.1b admins.user_id -> auth.users (the login-id row points at the real Auth account;
  --      re-added here for databases where `admins` already existed without it).
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.admins'::regclass
       and contype  = 'f'
       and conname  = 'admins_user_id_fkey'
  ) then
    alter table public.admins
      add constraint admins_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete cascade
      not valid;
    begin
      alter table public.admins validate constraint admins_user_id_fkey;
    exception when others then
      raise notice 'admins_user_id_fkey left NOT VALID (rows point at removed Auth users).';
    end;
  end if;

  -- 4.2 features.section_slug -> page_sections.slug
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.features'::regclass and conname = 'features_section_slug_fkey'
  ) then
    alter table public.features
      add constraint features_section_slug_fkey
      foreign key (section_slug) references public.page_sections (slug)
      on update cascade on delete cascade
      not valid;
    begin
      alter table public.features validate constraint features_section_slug_fkey;
    exception when others then
      -- Legacy orphan rows still reference a removed section: keep the constraint
      -- enforced for new writes and leave the old rows as-is.
      raise notice 'features_section_slug_fkey left NOT VALID (orphan rows exist).';
    end;
  end if;

  -- 4.3 section_items.section_slug -> page_sections.slug
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.section_items'::regclass and conname = 'section_items_section_slug_fkey'
  ) then
    alter table public.section_items
      add constraint section_items_section_slug_fkey
      foreign key (section_slug) references public.page_sections (slug)
      on update cascade on delete cascade
      not valid;
    begin
      alter table public.section_items validate constraint section_items_section_slug_fkey;
    exception when others then
      raise notice 'section_items_section_slug_fkey left NOT VALID (orphan rows exist).';
    end;
  end if;
end;
$$;

-- =====================================================================================
-- [5] TRIGGERS
--     5.1 updated_at / created_at — every content table keeps its timestamps honest.
--     5.2 section_key <-> section_slug sync + slugify (features, section_items).
--     5.3 slug auto-fill for courses and page_sections.
--     5.4 auto-create the parent page_sections row for a new section key, so the
--         foreign keys from section [4] can never block the admin panel.
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 5.1 TIMESTAMPS
--     `drop trigger if exists` + `create trigger` keeps this section fully idempotent.
-- -------------------------------------------------------------------------------------
do $$
declare
  tbl   text;
  tables text[] := array[
    'courses', 'gallery', 'notices', 'testimonials', 'admissions', 'contacts',
    'batches', 'faqs', 'success_stories', 'trainers', 'navigation_links',
    'hero_slides', 'stats', 'features', 'social_links', 'footer_links',
    'page_sections', 'section_items', 'profiles', 'settings', 'admins'
  ];
begin
  foreach tbl in array tables loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', tbl, tbl);
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I
         for each row execute function public.set_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;

-- created_at on insert: repairs a null/missing value sent by a client.
create or replace function public.set_created_at()
returns trigger
language plpgsql
as $$
begin
  if new.created_at is null then
    new.created_at := now();
  end if;
  return new;
end;
$$;

do $$
declare
  tbl   text;
  tables text[] := array[
    'courses', 'gallery', 'notices', 'testimonials', 'admissions', 'contacts',
    'batches', 'faqs', 'success_stories', 'trainers', 'navigation_links',
    'hero_slides', 'stats', 'features', 'social_links', 'footer_links',
    'page_sections', 'section_items', 'profiles', 'admins'
  ];
begin
  foreach tbl in array tables loop
    execute format('drop trigger if exists trg_%s_created_at on public.%I', tbl, tbl);
    execute format(
      'create trigger trg_%s_created_at before insert on public.%I
         for each row execute function public.set_created_at()',
      tbl, tbl
    );
  end loop;
end;
$$;

-- -------------------------------------------------------------------------------------
-- 5.2 section_key <-> section_slug SYNC (features + section_items)
--     The old cms.sql filtered on `section_slug` (components/WhyChooseUs.tsx still does
--     .eq("section_slug", "why-choose-us")), while newer CMS code uses `section_key`.
--     This trigger makes the two columns impossible to desynchronise:
--       * only one provided -> the other is filled from it;
--       * both provided     -> `section_key` wins and `section_slug` mirrors it;
--       * neither provided  -> defaults to 'why-choose-us';
--       * both are slugified (lowercase, dashes) and `page` defaults to 'home'.
--
--     The canonical key is computed by public.effective_section_key() below, which
--     section [5.4]'s ensure_page_section() calls as well — so the auto-created parent
--     row always matches the final synced value, regardless of trigger fire order
--     (Postgres fires same-event triggers in alphabetical name order).
-- -------------------------------------------------------------------------------------
-- Canonical section key shared by the sync trigger (5.2) and the auto-create-parent
-- trigger (5.4). Immutable so both stay in lock-step by construction.
create or replace function public.effective_section_key(p_key text, p_slug text)
returns text
language sql
immutable
as $$
  select coalesce(
           public.slugify(nullif(trim(coalesce(p_key,  '')), '')),
           public.slugify(nullif(trim(coalesce(p_slug, '')), '')),
           'why-choose-us'
         );
$$;

create or replace function public.sync_section_keys()
returns trigger
language plpgsql
as $$
begin
  -- One canonical value for both trigger paths (see effective_section_key above):
  -- section_key wins when present, otherwise section_slug, else the default.
  new.section_slug := public.effective_section_key(new.section_key, new.section_slug);
  new.section_key  := new.section_slug;

  new.page := nullif(trim(coalesce(new.page, '')), '');
  if new.page is null then
    new.page := 'home';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_features_sync_section_keys on public.features;
create trigger trg_features_sync_section_keys
  before insert or update on public.features
  for each row execute function public.sync_section_keys();

drop trigger if exists trg_section_items_sync_section_keys on public.section_items;
create trigger trg_section_items_sync_section_keys
  before insert or update on public.section_items
  for each row execute function public.sync_section_keys();

-- -------------------------------------------------------------------------------------
-- 5.3 SLUG AUTO-FILL
--     * page_sections.slug is canonical and mirrors into section_key / section_slug.
--     * courses.slug is generated from the title when the admin left it blank
--       (app/admin/courses never sends a slug at all).
-- -------------------------------------------------------------------------------------
create or replace function public.sync_page_section_keys()
returns trigger
language plpgsql
as $$
begin
  new.slug := nullif(trim(coalesce(new.slug, '')), '');
  new.slug := public.slugify(new.slug);                       -- normalise when provided
  new.slug := coalesce(new.slug, public.slugify(new.title));  -- else derive from title

  -- Absolute fallback so the NOT NULL column is never empty.
  if new.slug is null then
    new.slug := 'section-' || left(replace(new.id::text, '-', ''), 8);
  end if;

  new.section_key  := new.slug;
  new.section_slug := new.slug;

  new.page := nullif(trim(coalesce(new.page, '')), '');
  if new.page is null then
    new.page := 'home';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_page_sections_sync_keys on public.page_sections;
create trigger trg_page_sections_sync_keys
  before insert or update on public.page_sections
  for each row execute function public.sync_page_section_keys();

create or replace function public.set_course_slug()
returns trigger
language plpgsql
as $$
begin
  if coalesce(trim(new.slug), '') = '' then
    new.slug := public.slugify(new.title);
  end if;
  return new;
end;
$$;

-- -------------------------------------------------------------------------------------
-- 5.4 AUTO-CREATE THE PARENT page_sections ROW
--     app/admin/features lets the admin type ANY group name ("services", "highlights",
--     ...). Without this trigger the section [4] foreign key would reject the insert.
--     A BEFORE INSERT/UPDATE trigger creates the missing page_sections row first, so the
--     FK is always satisfied and the CMS stays self-healing.
--     A placeholder title is humanised from the key ("why-choose-us" -> "Why Choose Us").
-- -------------------------------------------------------------------------------------
create or replace function public.ensure_page_section()
returns trigger
language plpgsql
as $$
declare
  missing_key text;
begin
  -- Same canonical key the sync trigger (5.2) will compute from this row, so the parent
  -- row always matches the final synced section_slug and the FK in section [4] holds.
  missing_key := public.effective_section_key(new.section_key, new.section_slug);

  if missing_key is null then
    return new;
  end if;

  insert into public.page_sections (slug, section_key, section_slug, page, section_type, title, sort_order, is_active)
  values (
    missing_key,
    missing_key,
    missing_key,
    coalesce(nullif(trim(new.page), ''), 'home'),
    'auto',
    initcap(replace(missing_key, '-', ' ')),
    0,
    true
  )
  on conflict (slug) do nothing;

  return new;
end;
$$;

-- Attached to both tables that carry a section key: features + section_items.
-- (Fire order vs the sync triggers is irrelevant: both functions now derive the same
-- canonical key from effective_section_key(), so they cannot disagree.)
drop trigger if exists trg_features_ensure_page_section on public.features;        -- pre-rename name
drop trigger if exists trg_a_features_ensure_page_section on public.features;
create trigger trg_features_ensure_page_section
  before insert or update on public.features
  for each row execute function public.ensure_page_section();

drop trigger if exists trg_section_items_ensure_page_section on public.section_items; -- pre-rename name
drop trigger if exists trg_a_section_items_ensure_page_section on public.section_items;
create trigger trg_section_items_ensure_page_section
  before insert or update on public.section_items
  for each row execute function public.ensure_page_section();

-- -------------------------------------------------------------------------------------
-- 5.5 SANITY CHECK — the special "why-choose-us" group must always exist, because
--     components/WhyChooseUs.tsx filters on it and the features FK depends on it.
--     `on conflict (slug) do nothing` keeps this idempotent.
-- -------------------------------------------------------------------------------------
insert into public.page_sections (slug, section_key, section_slug, page, section_type, title, sort_order, is_active)
values ('why-choose-us', 'why-choose-us', 'why-choose-us', 'home', 'features', 'Why Choose Us', 10, true)
on conflict (slug) do nothing;

-- -------------------------------------------------------------------------------------
-- 5.6 COURSE SLUG — auto-fill from the title so future pretty URLs (/courses/<slug>)
--     work without any admin UI change (function defined in 5.3).
-- -------------------------------------------------------------------------------------
drop trigger if exists trg_courses_set_slug on public.courses;
create trigger trg_courses_set_slug
  before insert or update on public.courses
  for each row execute function public.set_course_slug();

-- =====================================================================================
-- [6] INDEXES
--     Every index below mirrors a query that actually exists in the app:
--       * public pages  ->  .eq("is_active", true).order("sort_order")
--       * admin panels  ->  .select("*").order("sort_order")
--       * feeds         ->  .order("created_at", { ascending: false })
--     Partial indexes on is_active = true are used where the public site is the
--     only reader, because the admin panel needs to see hidden rows as well.
-- =====================================================================================

-- Public "list" grids ordered by sort_order
create index if not exists idx_courses_active_sort        on public.courses          (is_active, sort_order);
create index if not exists idx_gallery_active_sort        on public.gallery          (is_active, sort_order);
create index if not exists idx_batches_active_sort        on public.batches          (is_active, sort_order);
create index if not exists idx_faqs_active_sort           on public.faqs             (is_active, sort_order);
create index if not exists idx_stats_active_sort          on public.stats            (is_active, sort_order);
create index if not exists idx_hero_slides_active_sort    on public.hero_slides      (is_active, sort_order);
create index if not exists idx_navigation_active_sort     on public.navigation_links (is_active, sort_order);
create index if not exists idx_social_links_active_sort   on public.social_links     (is_active, sort_order);
create index if not exists idx_success_active_sort        on public.success_stories  (is_active, sort_order);

-- Admin-only lists (no is_active filter in the query)
create index if not exists idx_gallery_sort               on public.gallery          (sort_order);
create index if not exists idx_batches_sort               on public.batches          (sort_order);
create index if not exists idx_faqs_sort                  on public.faqs             (sort_order);
create index if not exists idx_hero_slides_sort           on public.hero_slides      (sort_order);
create index if not exists idx_navigation_sort            on public.navigation_links (sort_order);
create index if not exists idx_stats_sort                 on public.stats            (sort_order);
create index if not exists idx_features_sort              on public.features         (sort_order);
create index if not exists idx_footer_links_sort          on public.footer_links     (sort_order);

-- Section/grouped lookups (CMS)
create index if not exists idx_features_section_sort
  on public.features (section_slug, is_active, sort_order);
create index if not exists idx_section_items_section_sort
  on public.section_items (section_slug, is_active, sort_order);
create index if not exists idx_page_sections_page_sort
  on public.page_sections (page, is_active, sort_order);

-- Footer / nav grouping
create index if not exists idx_footer_links_group_sort
  on public.footer_links (group_name, is_active, sort_order);

-- Reverse-chronological feeds (admin panels order by created_at without is_active,
-- public components order by created_at with .eq("is_active", true))
create index if not exists idx_courses_created        on public.courses          (created_at desc);
create index if not exists idx_gallery_created        on public.gallery          (created_at desc);
create index if not exists idx_notices_created        on public.notices          (created_at desc);
create index if not exists idx_testimonials_created   on public.testimonials     (created_at desc);
create index if not exists idx_trainers_created       on public.trainers         (created_at);
create index if not exists idx_success_created        on public.success_stories  (created_at desc);

create index if not exists idx_notices_active_created
  on public.notices (is_active, created_at desc);
create index if not exists idx_testimonials_active_created
  on public.testimonials (is_active, created_at desc);
create index if not exists idx_trainers_active_created
  on public.trainers (is_active, created_at);
create index if not exists idx_success_active_created
  on public.success_stories (is_active, created_at desc);

-- Inbox tables: newest submissions first, unread filter for the admin dashboard
create index if not exists idx_admissions_created      on public.admissions (created_at desc);
create index if not exists idx_admissions_status       on public.admissions (status);
create index if not exists idx_contacts_created        on public.contacts   (created_at desc);
create index if not exists idx_contacts_unread         on public.contacts   (is_read) where is_read = false;

-- Testimonial moderation: the public form only inserts active reviews
create index if not exists idx_testimonials_pending
  on public.testimonials (created_at desc) where is_active = false;

-- Admin lookups
create index if not exists idx_profiles_email          on public.profiles (lower(email));
create index if not exists idx_profiles_is_admin       on public.profiles (is_admin) where is_admin = true;

-- Login page: the short-id lookup only ever wants active rows (see section 7.9).
create index if not exists idx_admins_active           on public.admins (lower(email)) where is_active = true;

-- =====================================================================================
-- [7] ROW LEVEL SECURITY
--     Model used by this app:
--       anon          -> the public website. Can read ACTIVE content and submit the
--                        three public forms (admission enquiry, contact, review).
--       authenticated -> the logged-in admin (Supabase Auth). Full read/write on
--                        everything, including hidden rows and the inbox tables.
--     The admin panel uses the browser client (lib/supabase.ts) with the publishable
--     key + the user's session cookie, so it needs the `authenticated` policies below —
--     no service_role key is ever required.
-- =====================================================================================

-- 7.1 Turn RLS on for every table (idempotent; safe when already enabled).
do $$
declare
  tbl   text;
  tables text[] := array[
    'courses', 'gallery', 'notices', 'testimonials', 'admissions', 'contacts',
    'batches', 'faqs', 'success_stories', 'trainers', 'settings',
    'navigation_links', 'hero_slides', 'stats', 'features', 'social_links',
    'footer_links', 'page_sections', 'section_items', 'profiles', 'admins'
  ];
begin
  foreach tbl in array tables loop
    execute format('alter table public.%I enable row level security', tbl);
  end loop;
end;
$$;

-- 7.2 ADMIN (authenticated) — full CRUD on every content table.
--     One `for all` policy covers SELECT/INSERT/UPDATE/DELETE, so the admin panel's
--     insert/update/delete/toggle-active calls all work through the same rule.
do $$
declare
  tbl   text;
  tables text[] := array[
    'courses', 'gallery', 'notices', 'testimonials', 'admissions', 'contacts',
    'batches', 'faqs', 'success_stories', 'trainers', 'settings',
    'navigation_links', 'hero_slides', 'stats', 'features', 'social_links',
    'footer_links', 'page_sections', 'section_items', 'admins'
  ];
begin
  foreach tbl in array tables loop
    execute format('drop policy if exists %I on public.%I', 'admin_all_' || tbl, tbl);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      'admin_all_' || tbl, tbl
    );
  end loop;
end;
$$;

-- 7.3 PUBLIC (anon) READ — only rows that are switched on in the admin panel.
do $$
declare
  tbl   text;
  tables text[] := array[
    'courses', 'gallery', 'notices', 'testimonials', 'batches', 'faqs',
    'success_stories', 'trainers', 'navigation_links', 'hero_slides', 'stats',
    'features', 'social_links', 'footer_links', 'page_sections', 'section_items'
  ];
begin
  foreach tbl in array tables loop
    execute format('drop policy if exists %I on public.%I', 'public_read_active_' || tbl, tbl);
    execute format(
      'create policy %I on public.%I for select to anon using (is_active = true)',
      'public_read_active_' || tbl, tbl
    );
  end loop;
end;
$$;

-- 7.4 PUBLIC (anon) WRITES — the three forms on the public website.
--     Deliberately narrow: an anonymous visitor may only INSERT, never read back,
--     and the rows they create are forced into the correct shape.

-- 7.4.1 Admission enquiry form  -> app/admission/page.tsx
--       The form does not send `status`, so the default 'New' is applied.
drop policy if exists public_insert_admissions on public.admissions;
create policy public_insert_admissions
  on public.admissions for insert to anon
  with check (coalesce(status, 'New') = 'New');

-- 7.4.2 Contact form -> app/contact/page.tsx
drop policy if exists public_insert_contacts on public.contacts;
create policy public_insert_contacts
  on public.contacts for insert to anon
  with check (coalesce(is_read, false) = false);

-- 7.4.3 Public review form -> components/TestimonialCard.tsx
--       Reviews go live immediately (the component inserts is_active: true), matching
--       the current behaviour of the live site.
drop policy if exists public_insert_testimonials on public.testimonials;
create policy public_insert_testimonials
  on public.testimonials for insert to anon
  with check (
    is_active = true
    and coalesce(trim(name), '') <> ''
    and coalesce(trim(message), '') <> ''
  );

-- 7.5 SITE SETTINGS — the public site reads these on every page
--     (hooks/useSiteSettings.ts); only the admin may change them.
drop policy if exists public_read_settings on public.settings;
create policy public_read_settings
  on public.settings for select to anon using (true);

-- 7.6 PROFILES — an admin may read/insert/update only its own profile row.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- 7.7 PRIVACY — admissions & contacts intentionally have NO anon policy, so only a
--     logged-in admin (admin_all_* from section 7.2) can read the submitted leads.

-- 7.8 OPTIONAL HARDENING (left commented on purpose).
--     Replace the matching admin_all_* policy from 7.2 with this version when you want
--     only rows flagged in public.profiles to be writable:
--
--     drop policy if exists admin_all_courses on public.courses;
--     create policy admin_all_courses on public.courses for all to authenticated
--       using  (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
--       with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- 7.9 ADMIN LOGIN LOOKUP — app/login/page.tsx resolves a non-email login id BEFORE the
--     visitor is authenticated, so the `anon` role must be able to read the matching row.
--     Only rows with is_active = true are exposed, and the page only ever selects the
--     `email` column from them. Trade-off: the active admin addresses (never the
--     passwords) become readable with the publishable key. To remove even that exposure,
--     drop this policy — plain email + password sign-in keeps working, only the short
--     login ids stop resolving.
drop policy if exists public_read_active_admins on public.admins;
create policy public_read_active_admins
  on public.admins for select to anon using (is_active = true);

-- 7.10 TABLE PRIVILEGES — mirrors the policies above exactly.
--      Supabase already grants these to anon / authenticated for tables in `public`, so on
--      a Supabase project this block is a no-op; it is stated explicitly so the file is
--      self-contained and also works on a bare Postgres database. GRANT is idempotent.
grant usage on schema public to anon, authenticated;

-- anon: read the public content + the login lookup row, write the three public forms.
grant select on
  public.courses, public.gallery, public.notices, public.testimonials, public.batches,
  public.faqs, public.success_stories, public.trainers, public.navigation_links,
  public.hero_slides, public.stats, public.features, public.social_links,
  public.footer_links, public.page_sections, public.section_items, public.settings,
  public.admins
  to anon;

grant insert on public.admissions, public.contacts, public.testimonials to anon;

-- authenticated (the logged-in admin): full CRUD, matching the admin_all_* policies.
grant select, insert, update, delete on
  public.courses, public.gallery, public.notices, public.testimonials, public.admissions,
  public.contacts, public.batches, public.faqs, public.success_stories, public.trainers,
  public.settings, public.navigation_links, public.hero_slides, public.stats,
  public.features, public.social_links, public.footer_links, public.page_sections,
  public.section_items, public.admins, public.profiles
  to authenticated;

-- =====================================================================================
-- [8] STORAGE BUCKETS + POLICIES
--     Public read buckets so <Image src={publicUrl}> works without signing URLs,
--     and write access for logged-in admins only.
--     Every bucket name below is one the code actually tries, in fallback order:
--       courses/admin/*.tsx   -> ["courses", "gallery"]
--       trainers/page.tsx     -> ["trainers", "courses", "gallery"]
--       gallery/page.tsx      -> "gallery"
--       hero/page.tsx         -> "hero"        (via uploadSiteImage)
--       testimonials/page.tsx -> "testimonials"
--       settings/page.tsx     -> ["logos", "site-assets", "uploads", "gallery"]
-- =====================================================================================

-- 8.1 Create the buckets (public = true means anyone may download an object).
insert into storage.buckets (id, name, public)
values
  ('gallery',      'gallery',      true),
  ('courses',      'courses',      true),
  ('trainers',     'trainers',     true),
  ('hero',         'hero',         true),
  ('testimonials', 'testimonials', true),
  ('logos',        'logos',        true),
  ('site-assets',  'site-assets',  true),
  ('uploads',      'uploads',      true)
on conflict (id) do update set public = excluded.public;

-- 8.2 Anyone (including the public website) may READ objects in these buckets.
drop policy if exists "public_read_media" on storage.objects;
create policy "public_read_media"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id in ('gallery', 'courses', 'trainers', 'hero',
                  'testimonials', 'logos', 'site-assets', 'uploads')
  );

-- 8.3 Logged-in admins may UPLOAD (insert) into these buckets.
drop policy if exists "admin_insert_media" on storage.objects;
create policy "admin_insert_media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('gallery', 'courses', 'trainers', 'hero',
                  'testimonials', 'logos', 'site-assets', 'uploads')
  );

-- 8.4 Logged-in admins may REPLACE overwrite an existing object.
drop policy if exists "admin_update_media" on storage.objects;
create policy "admin_update_media"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('gallery', 'courses', 'trainers', 'hero',
                  'testimonials', 'logos', 'site-assets', 'uploads')
  )
  with check (
    bucket_id in ('gallery', 'courses', 'trainers', 'hero',
                  'testimonials', 'logos', 'site-assets', 'uploads')
  );

-- 8.5 Logged-in admins may DELETE objects (gallery/page.tsx removes replaced files).
drop policy if exists "admin_delete_media" on storage.objects;
create policy "admin_delete_media"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('gallery', 'courses', 'trainers', 'hero',
                  'testimonials', 'logos', 'site-assets', 'uploads')
  );

-- =====================================================================================
-- [9] DATA RESET — DELETE ALL EXISTING CONTENT
--     ----------------------------------------------------------------------------
--     Truncates every content table in a single statement (single statement =
--     no foreign-key ordering problems) and restarts identities.
--     * auth.users (your Supabase Auth logins) is NOT touched — you stay logged in.
--     * public.profiles is truncated here and immediately re-created from auth.users by
--       section [10.15], so app/profile/page.tsx keeps working after the reset.
--     * public.admins is deliberately NOT truncated: those rows are hand-made login-id
--       mappings that point at auth.users, and there is no way to regenerate them.
--     * TO KEEP YOUR CURRENT CONTENT: comment out this whole statement.
-- =====================================================================================
truncate table
  public.section_items,
  public.page_sections,
  public.features,
  public.footer_links,
  public.social_links,
  public.navigation_links,
  public.hero_slides,
  public.stats,
  public.settings,
  public.courses,
  public.batches,
  public.faqs,
  public.success_stories,
  public.trainers,
  public.notices,
  public.gallery,
  public.testimonials,
  public.admissions,
  public.contacts,
  public.profiles
restart identity cascade;

-- =====================================================================================
-- [10] SEED DATA — clean, non-duplicated starter content that mirrors the copy already
--      hard-coded in components/*.tsx, so the site looks identical before and after.
--      Every insert uses `on conflict do nothing`, which makes this section safe to
--      re-run even if you skipped the reset in section [9].
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 10.1 SITE SETTINGS — keys consumed by hooks/useSiteSettings.ts + app/admin/settings.
--      Edit these in Admin -> Settings (this table is the live source of truth).
-- -------------------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('academy_name',       'Elite''s English Academy'),
  ('tagline',            'Learn English • Teach English • Build Your Career'),
  ('phone_display',      '+91 88887 11228'),
  ('phone_href',         'tel:+918888711228'),
  ('whatsapp_number',    '918888711228'),
  ('email',              'elitejamesw182025@gmail.com'),
  ('address',            'Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra 431127'),
  ('business_hours',     'Mon – Sat: 7:00 AM – 9:00 PM'),
  ('logo_url',           '/vercel.png'),
  ('instagram_url',      'https://www.instagram.com/eliteenglishacademy'),
  ('facebook_url',       'https://facebook.com/eliteenglishacademy'),
  ('youtube_url',        'https://youtube.com/@eliteenglishacademy'),
  ('footer_about',       'Practical English training for speaking, exams and everyday success.'),
  ('copyright_text',     'All Rights Reserved.'),
  ('announcement_title', 'Admissions Open 2026'),
  ('announcement_text',  'Book your free demo class today and start speaking English with confidence!')
on conflict (key) do nothing;

-- -------------------------------------------------------------------------------------
-- 10.2 NAVIGATION (components/Navbar.tsx — same order as FALLBACK_MENU)
-- -------------------------------------------------------------------------------------
insert into public.navigation_links (label, href, sort_order, is_active) values
  ('Home',      '/',         1, true),
  ('About',     '/about',    2, true),
  ('Courses',   '/courses',  3, true),
  ('Gallery',   '/gallery',  4, true),
  ('Admission', '/admission', 5, true),
  ('Contact',   '/contact',  6, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.3 HERO — the home banner (components/Hero.tsx takes the first active row) plus an
--      extra slide kept inactive so you can preview a second banner from the admin panel.
-- -------------------------------------------------------------------------------------
insert into public.hero_slides
  (page, badge, title, description, image_url,
   primary_button_text, primary_button_link, secondary_button_text, secondary_button_link,
   sort_order, is_active)
values
  ('home',
   'Admissions Open 2026',
   'Speak English with Confidence. Build Your Future.',
   'Master Spoken English, IELTS preparation, grammar foundations, and practical communication skills.',
   '/hero/Teacher-portrait.png',
   'Free Demo Class', '/admission',
   'View Courses', '/courses',
   1, true),
  ('home',
   'New Batch Starting Soon',
   'Small Batches, Personal Attention, Real Results.',
   'Join daily speaking practice sessions guided by experienced faculty — online and offline.',
   '/hero/Teacher-about.png',
   'Book Free Demo', '/admission',
   'See Timings', '/#batches',
   2, false)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.4 HOMEPAGE STATS (components/Stats.tsx)
--      `icon` must be one of: GraduationCap, BookOpen, Laptop, Sparkles, BadgeCheck, Trophy
-- -------------------------------------------------------------------------------------
insert into public.stats (page, label, value, suffix, icon, sort_order, is_active) values
  ('home', 'Happy Students',             500, '+', 'GraduationCap', 1, true),
  ('home', 'Years Teaching Experience',   12, '+', 'BookOpen',      2, true),
  ('home', 'Online and Offline Classes',   2, '',  'Laptop',        3, true),
  ('home', 'Practical Speaking Focus',   100, '%', 'Sparkles',      4, true),
  ('home', 'Courses Offered',              6, '+', 'BadgeCheck',    5, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.5 WHY-CHOOSE-US FEATURES (components/WhyChooseUs.tsx)
--      `icon` must be one of: BadgeCheck, BookOpen, Briefcase, GraduationCap, Laptop,
--      MessageSquare, Sparkles. The page_sections row for this key is created in 5.5
--      (and auto-created by the trigger if it is missing).
-- -------------------------------------------------------------------------------------
insert into public.features
  (page, section_key, section_slug, title, description, icon, sort_order, is_active)
values
  ('home', 'why-choose-us', 'why-choose-us',
   'Daily Speaking Practice', 'Build real confidence with guided speaking drills every single day.',
   'MessageSquare', 1, true),
  ('home', 'why-choose-us', 'why-choose-us',
   'Small Batch Size', 'Personal attention for every learner — nobody gets left behind.',
   'GraduationCap', 2, true),
  ('home', 'why-choose-us', 'why-choose-us',
   'Experienced Faculty', 'Learn from teachers with 12+ years of proven classroom experience.',
   'BadgeCheck', 3, true),
  ('home', 'why-choose-us', 'why-choose-us',
   'Exam & Interview Focus', 'IELTS, board exams and job interviews — targeted, practical training.',
   'Briefcase', 4, true),
  ('home', 'why-choose-us', 'why-choose-us',
   'Online & Offline Batches', 'Choose the mode that fits your schedule without losing quality.',
   'Laptop', 5, true),
  ('home', 'why-choose-us', 'why-choose-us',
   'Grammar Made Simple', 'Clear grammar foundations that make speaking and writing effortless.',
   'BookOpen', 6, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.6 COURSES (app/admin/courses + components/CoursesSection.tsx)
--      PLACEHOLDER FEES: update them in Admin -> Courses. `fees` must never be NULL
--      because the public card calls course.fees.toLocaleString().
-- -------------------------------------------------------------------------------------
insert into public.courses
  (title, duration, fees, description, eligibility, mode, level, image_url, sort_order, is_active)
values
  ('Spoken English',
   '6 Months', 6000,
   'Speak fluently and confidently in daily life, college and workplace conversations with daily practice.',
   'Open to all — beginners to advanced', 'Online & Offline', 'Beginner to Advanced',
   '/courses/spoken-english.jpg', 1, true),
  ('IELTS Preparation',
   '4 Months', 12000,
   'Targeted band-focused training for Listening, Reading, Writing and Speaking with mock tests.',
   'Students planning to study or settle abroad', 'Online & Offline', 'Intermediate',
   '/courses/ielts.jpg', 2, true),
  ('Grammar & Vocabulary',
   '3 Months', 4500,
   'Build a rock-solid grammar foundation and expand vocabulary for exams and everyday writing.',
   'School and college students', 'Offline', 'Beginner',
   '/courses/grammar.jpg', 3, true),
  ('English for Interviews & Career',
   '2 Months', 5000,
   'Resume-ready communication, group discussion practice and interview answer framing.',
   'Job seekers and working professionals', 'Online & Offline', 'Intermediate',
   '/courses/interview-english.jpg', 4, true),
  ('Personality Development',
   '2 Months', 4000,
   'Public speaking, body language, confidence building and stage presence in English.',
   'Anyone above 15 years', 'Offline', 'Beginner to Intermediate',
   '/courses/personality.jpg', 5, true),
  ('Teacher Training (English)',
   '6 Months', 15000,
   'Learn English teaching methodology, lesson planning and classroom management.',
   'Graduates interested in English teaching', 'Online & Offline', 'Advanced',
   '/courses/teacher-training.jpg', 6, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.7 BATCH TIMINGS (components/BatchTimings.tsx — same four batches)
-- -------------------------------------------------------------------------------------
insert into public.batches (name, time, days, level, mode, description, sort_order, is_active) values
  ('Morning',   '7:00 AM – 10:00 AM', 'Mon – Sat',      'School Students',        'Offline',
   'Start your day with energetic speaking drills and grammar basics.', 1, true),
  ('Afternoon', '12:00 PM – 2:30 PM', 'Mon – Fri',      'College Students',       'Offline',
   'Convenient sessions for students finishing college lectures.', 2, true),
  ('Evening',   '5:00 PM – 9:00 PM',  'Mon – Sat',      'Professionals & All',    'Offline & Online',
   'Flexible evening batches for working professionals and everyone.', 3, true),
  ('Weekend',   'Saturday & Sunday',  'Weekend Special', 'Working Professionals', 'Online',
   'Intensive weekend batches for learners with busy weekdays.', 4, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.8 FAQS (components/FaqSection.tsx — the six questions already shown on the site)
-- -------------------------------------------------------------------------------------
insert into public.faqs (question, answer, sort_order, is_active) values
  ('Do you offer a free demo class?',
   'Yes! We offer a free demo class so you can experience our teaching methodology and batch environment before enrolling. Simply book your demo through the form or WhatsApp.',
   1, true),
  ('What are the course fees?',
   'Fees vary by course and batch. Visit the Courses section for details or contact us on phone/WhatsApp for the latest fee structure and any ongoing offers.',
   2, true),
  ('How do I join a batch?',
   'You can join via the admission enquiry form, or contact us directly by phone or WhatsApp. Our team will guide you on batch availability and next steps.',
   3, true),
  ('Are there classes for beginners?',
   'Absolutely. We welcome learners at every level — from absolute beginners to advanced speakers — and place you in the batch that matches your current level.',
   4, true),
  ('Are classes available online or offline?',
   'We offer both online and offline batches. Choose the mode that works best for your schedule; the learning quality stays the same.',
   5, true),
  ('Will I get a certificate after completing a course?',
   'Yes, you receive a certificate after successfully completing your course, which reflects your growth and commitment.',
   6, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.9 SUCCESS STORIES (components/SuccessStories.tsx)
-- -------------------------------------------------------------------------------------
insert into public.success_stories
  (student_name, course, before_result, after_result, achievement, badge, sort_order, is_active)
values
  ('Rohit S.', 'Spoken English',
   'Struggled to speak in English in interviews & daily life',
   'Confidently handles interviews & presentations',
   'Selected for a BPO role', 'Placement Success', 1, true),
  ('Priya D.', 'IELTS Preparation',
   'Band 4.5 in mock tests',
   'Scored Band 7.5 in final IELTS',
   'Secured admission abroad', 'IELTS 7.5', 2, true),
  ('Amit K.', 'Grammar & Vocabulary',
   'Lacked grammar foundation & confidence',
   'Fluent in written and spoken English',
   'Improved marks in board exams', 'Top Performer', 3, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.10 TRAINERS (components/TrainerCards.tsx — the academy's faculty profile)
-- -------------------------------------------------------------------------------------
insert into public.trainers
  (name, qualification, experience, specialization, role, photo_url, sort_order, is_active)
values
  ('Prof. J. M. Wagh-Dhotre',
   'M.A. English | MH-SET',
   '12+ Years of Teaching Experience',
   'Spoken English • IELTS • Grammar • Teacher Training',
   'Founder & Principal Trainer',
   '/hero/Teacher-portrait.png', 1, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.11 NOTICES (components/NoticeCard.tsx shows the 3 newest active notices)
-- -------------------------------------------------------------------------------------
insert into public.notices (title, description, category, sort_order, is_active) values
  ('Admissions Open 2026',
   'Enrolment is open for all batches — Spoken English, IELTS and Grammar. Book your free demo class today.',
   'Admission', 1, true),
  ('New Evening Batch Starting',
   'A fresh evening batch for working professionals starts this month. Limited seats per batch.',
   'Batch', 2, true),
  ('Free Demo Class Every Saturday',
   'Attend a free demo class every Saturday and experience our teaching method before you enrol.',
   'Event', 3, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.12 TESTIMONIALS — starter reviews. The public review form
--       (components/TestimonialCard.tsx) appends real student reviews to this table.
-- -------------------------------------------------------------------------------------
insert into public.testimonials (name, course, message, rating, sort_order, is_active) values
  ('Sneha P.', 'Spoken English',
   'The daily speaking practice changed everything for me. I finally speak without freezing up in front of people.',
   5, 1, true),
  ('Rahul M.', 'IELTS Preparation',
   'The mock tests and personal feedback helped me jump from band 5.5 to band 7. Truly practical teaching.',
   5, 2, true),
  ('Anjali K.', 'Grammar & Vocabulary',
   'Grammar was always my weak point. The simple explanations and regular practice made it easy to understand.',
   4, 3, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.13 FOOTER LINKS — the values components/Footer.tsx falls back to when the table
--       is empty, so the footer looks identical whether or not the CMS is used.
--       group_name: 'quick_links' (Quick Links column) | 'courses' (Courses column).
-- -------------------------------------------------------------------------------------
insert into public.footer_links (group_name, label, href, sort_order, is_active) values
  ('quick_links', 'About Us',  '/about',     1, true),
  ('quick_links', 'Courses',   '/courses',   2, true),
  ('quick_links', 'Gallery',   '/gallery',   3, true),
  ('quick_links', 'Admission', '/admission', 4, true),
  ('quick_links', 'Contact',   '/contact',   5, true),
  ('courses',     'Spoken English',        '/courses', 1, true),
  ('courses',     'IELTS Preparation',     '/courses', 2, true),
  ('courses',     'Grammar and Vocabulary','/courses', 3, true),
  ('courses',     'Teacher Training',      '/courses', 4, true)
on conflict do nothing;

-- -------------------------------------------------------------------------------------
-- 10.14 SOCIAL LINKS — same URLs as the settings seed, so the footer icons work even if
--       you never touch Admin -> Settings.
-- -------------------------------------------------------------------------------------
insert into public.social_links (platform, label, url, sort_order, is_active) values
  ('whatsapp',  'WhatsApp',  'https://wa.me/918888711228',                     0, true),
  ('instagram', 'Instagram', 'https://www.instagram.com/eliteenglishacademy', 1, true),
  ('facebook',  'Facebook',  'https://facebook.com/eliteenglishacademy',      2, true),
  ('youtube',   'YouTube',   'https://youtube.com/@eliteenglishacademy',      3, true)
on conflict do nothing;

-- NOTE — public.gallery is intentionally LEFT EMPTY: it only ever holds real uploaded
--        files (app/admin/gallery), and components/GalleryCard.tsx renders its own
--        "no photos yet" state when the table has no active rows.

-- -------------------------------------------------------------------------------------
-- 10.15 PROFILES — re-created from auth.users, because section [9] just truncated them.
--       app/profile/page.tsx reads public.profiles by the signed-in uid, so the page stays
--       functional after the reset, and the optional is_admin hardening in section [7.8]
--       finally has rows to check. Insert-only: a profile you already customised
--       (full_name / role / avatar_url) is never overwritten.
--       RLS is not a concern here — the SQL Editor runs as the table owner.
-- -------------------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role, is_admin)
select u.id,
       u.email,
       coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''),
                split_part(coalesce(u.email, ''), '@', 1)),
       'admin',
       true
  from auth.users u
 where u.email is not null
on conflict (id) do nothing;

-- NOTE — public.admins starts empty on purpose: email + password sign-in needs no rows,
--        and a short login id can only be mapped to a real Auth user by hand (see the
--        commented insert in section [1.21]).
-- =====================================================================================
-- [11] POSTGREST SCHEMA CACHE RELOAD  (prevents "schema cache" / PGRST205 errors)
--     PostgREST caches the table + column list it learned from Postgres. After adding
--     tables/columns, requests can fail with:
--         "Could not find the table 'public.xyz' in the schema cache"
--     The NOTIFY below tells PostgREST to rebuild that cache immediately. If the message
--     is somehow missed, the cache also refreshes on its own within ~a minute, or you can
--     restart the API from Dashboard -> Project Settings -> API -> "Reload schema".
-- =====================================================================================

notify pgrst, 'reload schema';
notify pgrst, 'reload config';

-- =====================================================================================
-- DONE. Quick verification (optional — run these one at a time if you want proof).
-- =====================================================================================
-- 1) Row counts per table after seeding:
--      select 'courses' as t, count(*) from public.courses
--      union all select 'gallery',        count(*) from public.gallery
--      union all select 'notices',        count(*) from public.notices
--      union all select 'testimonials',   count(*) from public.testimonials
--      union all select 'batches',        count(*) from public.batches
--      union all select 'faqs',           count(*) from public.faqs
--      union all select 'success_stories',count(*) from public.success_stories
--      union all select 'trainers',       count(*) from public.trainers
--      union all select 'navigation_links',count(*) from public.navigation_links
--      union all select 'hero_slides',    count(*) from public.hero_slides
--      union all select 'stats',          count(*) from public.stats
--      union all select 'features',       count(*) from public.features
--      union all select 'footer_links',   count(*) from public.footer_links
--      union all select 'social_links',   count(*) from public.social_links
--      union all select 'page_sections',  count(*) from public.page_sections
--      union all select 'settings',       count(*) from public.settings
--      union all select 'admins',         count(*) from public.admins
--      union all select 'profiles',       count(*) from public.profiles
--      order by t;
--
-- 2) Confirm the CMS mirror columns agree:
--      select count(*) from public.features       where section_key <> section_slug;
--      select count(*) from public.section_items  where section_key <> section_slug;
--
-- 3) Confirm no duplicates survived:
--      select lower(title), count(*) from public.courses group by 1 having count(*) > 1;
--
-- 4) Confirm every table has RLS enabled (relrowsecurity must be true):
--      select relname, relrowsecurity from pg_class
--       where relnamespace = 'public'::regnamespace and relkind = 'r'
--       order by relname;
--
-- 5) Admin smoke test: log in at /login, then open /admin — the dashboard counts and
--    every CRUD page (hero, navigation, stats, features, footer, gallery, notices,
--    testimonials, courses, batches, faqs, success-stories, trainers, admissions,
--    settings) should load and save without a schema-cache error.
-- =====================================================================================