# Elite's English Academy

A modern, full-stack website for **Elite's English Academy** — a spoken English, IELTS, grammar, phonics, and teacher-training institute located in Georai, District Beed, Maharashtra, India.

Built with **Next.js 16 (App Router)**, **Supabase**, and **Tailwind CSS v4**, and deployed to **Cloudflare Workers** via **OpenNext**.

> 🧹 **Status:** the codebase has been through a senior-level cleanup pass — a shared UI component kit, reusable hooks, a typed API client, a consolidated Royal Blue + Gold design system, and zero lint errors. See [Code Quality](#-code-quality).

---

## 🏫 About the Academy

> **Learn English • Teach English • Build Your Career**

Elite's English Academy is led by **Prof. J. M. Wagh-Dhotre** (M.A. English | MH-SET) with **12+ years of teaching experience**. The academy offers:

- 🗣️ **Spoken English** — practical speaking training for confidence
- 🌍 **IELTS Preparation** — exam-focused coaching
- 📚 **Grammar & Vocabulary** — structured language foundation
- 🎓 **Teacher Training** — "Confident English Teacher Program"
- 🧑‍🏫 **Personal Mentorship** — one-on-one guidance and mentoring
- 🔤 **Phonics Training** — early reading and pronunciation skills

---

## ✨ Features

### Public Website
- **Home page** with announcement banner, hero, stats, success stories, about + mission/vision, trainers, why-choose-us, courses, batch timings, testimonials carousel, notices, FAQs, admission CTA, and gallery sections
- **Courses page** — dynamic course listings fetched from Supabase with fees, duration, eligibility, mode, and images
- **Admission page** — enquiry form (name, phone, email, class, course, preferred batch, message) submitted through the typed API client, with a WhatsApp enquiry option
- **Contact page** — contact details, business hours, Google Maps embed, WhatsApp/call, social links, and an enquiry form with inline success/error alerts
- **Notices, Testimonials, Gallery, About** pages — all content driven by Supabase with built-in fallbacks when tables are empty
- **Floating WhatsApp button** + **scroll-to-top button** — quick chat and navigation (single shared scroll listener)
- **Accessibility** — labelled form controls wired via `aria-describedby`, `aria-current` navigation, `role="dialog"` modals, keyboard-dismissable overlays, focus-visible rings
- **SEO** — metadata, Open Graph, Twitter cards, sitemap, and robots.txt

### Admin Dashboard (`/admin`)
- **Server-side auth guard** — every admin page verifies the Supabase session and redirects to `/login` if unauthenticated
- **Dashboard** — live counts of courses, trainers, batches, success stories, testimonials, FAQs, gallery, notices, and admissions
- **CRUD for every section** — courses, trainers, batches, success stories, testimonials, FAQs, gallery, notices, hero slides, stats, features, navigation links, footer links, social links, settings
- **Admissions & enquiries management** — view, update status, search, filter, and client-side pagination
- **Accessible delete confirmation** — every destructive action opens a shared `ConfirmDialog` modal (no browser `confirm()` anywhere)
- **Consistent states** — shared `EmptyState` blocks and loading states across all admin tables and lists
- **Image upload** — courses, trainers, and gallery upload to Supabase Storage
- **Profile** — user profile page
- **Secure API route** — `/api/admin/health` protected by `requireAdminApi` guard

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16.3.5](https://nextjs.org) (App Router, React 19) |
| **Language** | TypeScript 5 (strict, `tsc --noEmit` clean) |
| **Styling** | Tailwind CSS v4 + PostCSS, Royal Blue + Gold `@theme` tokens |
| **Backend / Database** | [Supabase](https://supabase.com) (Postgres, Auth, Storage) |
| **Auth** | `@supabase/ssr` (browser + server clients) |
| **Validation** | Zod — shared schemas enforced on both client and server |
| **Animations** | Framer Motion 13 (reduced-motion aware) |
| **Icons** | lucide-react |
| **Class merging** | clsx (via `lib/utils.ts` `cn()` helper) |
| **Deployment** | Cloudflare Workers via `@opennextjs/cloudflare` + Wrangler |

> ℹ️ `react-hook-form` and `sonner` are declared in `package.json` but are **not currently used** — forms use controlled state + Zod, and notifications use inline `Alert`/notice components. They are removal candidates.

---

## 📁 Project Structure

```
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout + global SEO metadata
│   ├── globals.css             # Design system (tokens + all component classes)
│   ├── page.tsx                # Home page
│   ├── about/ admission/ contact/ courses/ gallery/ notices/ testimonials/
│   ├── login/                  # Admin login (rate-limited API)
│   ├── profile/                # User profile
│   ├── admin/                  # Admin dashboard (protected)
│   │   ├── layout.tsx          # Server-side auth guard
│   │   ├── AdminShell.tsx      # Shared admin chrome
│   │   ├── page.tsx            # Dashboard with content counts
│   │   ├── courses/ trainers/ batches/ success-stories/ testimonials/
│   │   ├── faqs/ gallery/ notices/ admissions/ enquiries/
│   │   ├── hero/ stats/ features/ navigation/ footer/ settings/
│   │   └── api: /api/admin/{health,admissions,content}
│   ├── api/                    # Route handlers (auth, admissions, enquiries, testimonials)
│   ├── robots.ts               # robots.txt
│   └── sitemap.ts              # sitemap.xml
│
├── components/
│   ├── ui/                     # UI kit — see below, single import point: @/components/ui
│   ├── home/                   # HomePage composition + SectionHeading/SectionBadge
│   ├── Navbar.tsx  Footer.tsx  Hero.tsx  Stats.tsx
│   ├── AboutSection  WhyChooseUs  CoursesSection  TrainerCards
│   ├── SuccessStories  BatchTimings  TestimonialCard  NoticeCard
│   ├── FaqSection  GalleryCard  CallToAction  AnnouncementBanner
│   ├── AdmissionForm  FloatingWhatsApp  ScrollToTop
│   ├── Sidebar.tsx  DashboardCard.tsx   # admin chrome
│
├── hooks/                      # Custom React hooks
│   ├── useConfirmDelete.tsx    # Accessible delete confirmation (15 admin pages)
│   ├── useDisclosure.ts        # Modal state + body scroll lock + Escape key
│   ├── useMounted.ts           # SSR-safe mounted + reduced-motion flags
│   ├── useScrolled.ts          # Shared passive scroll-position hook
│   ├── useSupabaseQuery.ts     # Generic data fetching (data/loading/error/refetch)
│   └── useSiteSettings.ts      # Settings map + WhatsApp link + image upload
│
├── lib/
│   ├── api-client.ts           # Typed fetch wrapper (ApiError, timeouts, safe messages)
│   ├── api-auth.ts             # API route auth guard
│   ├── auth.ts                 # Server-side auth guards
│   ├── client-errors.ts        # Client-safe error message allowlist
│   ├── constants.ts            # Nav/footer fallbacks, PAGE_SIZE
│   ├── errors.ts               # Server error logging + safe public messages
│   ├── rate-limit.ts           # Login rate limiting
│   ├── site.ts                 # Academy contact/config constants
│   ├── supabase.ts             # Browser Supabase client
│   ├── supabase-server.ts      # Server Supabase client (SSR cookies)
│   ├── utils.ts                # cn() class merger
│   └── validation.ts           # Zod schemas shared by client + API
│
├── types/                      # course, gallery, notice, testimonial, global.d.ts
├── public/                     # Static assets (hero images, favicon, placeholders)
├── wrangler.jsonc              # Cloudflare Workers config
├── open-next.config.ts         # OpenNext config
├── eslint.config.mjs           # ESLint 9 flat config
└── package.json
```

---

## 🎨 Design System & UI Kit

All styling tokens live in **`app/globals.css`** (single stylesheet — the old `ui-helpers.css` was merged in). Brand tokens are defined as Tailwind v4 `@theme` variables:

| Token | Value | Use |
|-------|-------|-----|
| `--color-royal-500` | `#2563eb` | Primary blue (buttons, links) |
| `--color-royal-900` | `#0b1f4d` | Dark blue (nav, footer, tables) |
| `--color-gold-400` | `#facc15` | Gold accent (badges, CTAs) |

Import everything from the kit barrel:

```tsx
import { Button, Input, Select, Textarea, Badge, Alert, Modal,
         ConfirmDialog, Table, Pagination, EmptyState, LoaderBlock } from "@/components/ui";
```

| Component | Notes |
|-----------|-------|
| `Button` | Variants (primary/secondary/accent/ghost/danger), sizes, loading state, icon slots, disabled, `forwardRef` |
| `Input` / `Select` / `Textarea` / `Field` | Label + hint + error wiring, `aria-invalid`/`aria-describedby`, error styling, custom select chevron |
| `Badge` | 6 colour variants |
| `Alert` | info / success / warning / error (`role="alert"` only for errors) |
| `LoaderBlock` | Block-level spinner with `role="status"` |
| `Modal` | Escape-to-close, body scroll lock, focus management, `aria-modal` |
| `ConfirmDialog` | Standard destructive-action confirmation with loading state |
| `Table` + `TableHead/TableBody/TableRow/Th/Td` | Responsive scroll wrapper, `scope="col"` headers, hover rows |
| `Pagination` | Prev/next with bounds + `aria-live` status |
| `EmptyState` | Icon + title + description + optional action |

Every component is consumed by real pages (admin CRUD, enquiries, contact, notices) — the kit contains no dead code.

---

## 🧱 Code Quality

The project follows a strict error-handling and data-fetching policy:

- **Users never see internals** — API routes return curated messages (`lib/errors.ts`); client errors pass through an allowlist filter (`lib/client-errors.ts`). Full details are logged server-side only.
- **One validation source** — Zod schemas in `lib/validation.ts` are enforced on both the client (instant feedback) and the server (authoritative).
- **Typed API layer** — public forms submit via `lib/api-client.ts` (`apiFetch`), which normalizes JSON parsing, timeouts, and `ApiError` messages.
- **Standardized data fetching** — client sections use `useSupabaseQuery` (loading/error/refetch) instead of copy-pasted `useEffect` blocks.
- **No browser dialogs** — all destructive actions use the shared `ConfirmDialog`; form feedback uses inline `Alert` components.

### Verification commands

```bash
npx tsc --noEmit    # TypeScript — clean
npx eslint .        # ESLint 9 — 0 errors (pre-existing <img> warnings only)
npm run build       # Production build — compiles, generates all pages
```

> The `react-hooks/set-state-in-effect` rule is scoped-off for the admin mount-load pattern in `eslint.config.mjs`, with a documented rationale (every `setState` runs after an `await`).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (or Bun)
- **npm** / **yarn** / **pnpm**
- A **Supabase** project (URL + publishable key)
- A **Cloudflare** account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/RohanMagar7/EliteEnglishAcademy.git
cd EliteEnglishAcademy
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

> ⚠️ **Never commit `.env` files or secrets.** The publishable key is safe for client use; the service-role key must **never** be used in client code.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 🗄️ Supabase Setup

The app expects the following tables in your Supabase project:

| Table | Purpose |
|-------|---------|
| `courses` | Course listings (title, duration, eligibility, fees, mode, description, image_url) |
| `trainers` | Trainer/faculty profiles |
| `batches` | Batch timings (morning/afternoon/evening/weekend) |
| `success_stories` | Before/after student success stories |
| `testimonials` | Student testimonials |
| `faqs` | FAQ accordion items |
| `gallery` | Gallery images |
| `notices` | Announcements and notices |
| `admissions` | Admission form submissions (admin managed) |
| `enquiries` | Contact-form messages (admin managed) |
| `hero_slides` | Home hero banner content |
| `stats` | Home page statistics |
| `features` | "Why choose us" feature cards |
| `navigation_links` | Header navigation (editable from admin) |
| `footer_links` | Footer quick links + course links |
| `social_links` | Footer social media icons |
| `settings` | Key/value site-wide configuration (name, tagline, phone, hours…) |
| `admins` / `profiles` | Admin login lookup and profiles |

> 💡 **Quick setup:** run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates all tables, public-read + insert RLS policies, and the storage buckets. Most sections render with sensible built-in defaults if the tables are empty, so the site still looks great before you add content.

**Storage buckets:** `courses`, `gallery`, `trainers`, `uploads` (for image uploads).

**Auth:** Supabase Auth is used for admin login. The admin layout calls `requireAdmin()` on every page load, which validates the JWT server-side and redirects to `/login` if the session is invalid or expired. Login attempts are rate-limited server-side (`lib/rate-limit.ts`).

> 🔒 **RLS (Row-Level Security):** Client-side database calls require appropriate RLS policies. The schema enables public read/insert; configure authenticated write policies for the admin role as described in the file.

---

## ☁️ Deployment (Cloudflare Workers)

This project is configured to deploy to **Cloudflare Workers** using **OpenNext**.

### Local Preview

```bash
npm run preview
```

This runs `opennextjs-cloudflare build` and starts a local Wrangler dev server.

### Deploy to Production

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` and deploys the worker with `wrangler deploy`.

### Cloudflare Configuration (`wrangler.jsonc`)

- **Worker name:** `eliteenglishacademy`
- **Compatibility flags:** `nodejs_compat`, `global_fetch_strictly_public`
- **Assets:** served from `.open-next/assets`
- **Image optimization:** enabled via the `IMAGES` binding
- **Self-reference service binding:** `WORKER_SELF_REFERENCE` (required for OpenNext caching)

---

## 📄 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the Next.js app for production |
| `npm run preview` | Build with OpenNext and preview locally via Wrangler |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare Workers |
| `npx tsc --noEmit` | Type-check without emitting |
| `npx eslint .` | Lint the project |

---

## 📞 Contact

- **Phone:** +91 88887 11228
- **Email:** elitejamesw182025@gmail.com
- **WhatsApp:** [wa.me/918888711228](https://wa.me/918888711228)
- **Instagram:** [@eliteenglishacademy](https://www.instagram.com/eliteenglishacademy)
- **Address:** Elite's English Academy, Near Sai Deep Hospital, Mondha Naka, Georai, District Beed, Maharashtra – 431127, India

---

## 📄 License

This project is private and proprietary to Elite's English Academy. All rights reserved.
