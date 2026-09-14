# Elite's English Academy

A modern, full-stack website for **Elite's English Academy** — a spoken English, IELTS, grammar, phonics, and teacher-training institute located in Georai, District Beed, Maharashtra, India.

Built with **Next.js 16 (App Router)**, **Supabase**, and **Tailwind CSS v4**, and deployed to **Cloudflare Workers** via **OpenNext**.

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
- **Home page** with hero, stats, about, why-choose-us, courses, testimonials, notices, admission CTA, and gallery sections
- **Courses page** — dynamic course listings fetched from Supabase with fees, duration, mode, and images
- **Admission page** — enquiry form that saves directly to Supabase
- **Notices page** — latest announcements and updates
- **Testimonials page** — student reviews and success stories
- **Gallery page** — photo gallery of the academy
- **About page** — academy story and instructor profile
- **Contact page** — contact details, map, phone, email, and WhatsApp
- **Floating WhatsApp button** — quick chat with the academy
- **SEO optimized** — metadata, Open Graph, Twitter cards, sitemap, and robots.txt

### Admin Dashboard (`/admin`)
- **Server-side auth guard** — every admin page verifies the Supabase session and redirects to `/login` if unauthenticated
- **Dashboard** — live counts of courses, gallery images, notices, and testimonials
- **Courses management** — add, list, and delete courses (with image upload to Supabase Storage)
- **Gallery management** — upload and manage gallery images
- **Notices management** — publish and manage notices
- **Testimonials management** — add and manage student testimonials
- **Settings** — academy configuration
- **Profile** — user profile page
- **Secure API route** — `/api/admin/health` protected by `requireAdminApi` guard

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16.3.5](https://nextjs.org) (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + PostCSS |
| **Backend / Database** | [Supabase](https://supabase.com) (Postgres, Auth, Storage) |
| **Auth** | `@supabase/ssr` (browser + server clients) |
| **Animations** | Framer Motion 13 |
| **Forms** | React Hook Form + Zod |
| **Icons** | lucide-react |
| **Toasts** | sonner |
| **Deployment** | Cloudflare Workers via `@opennextjs/cloudflare` + Wrangler |

---

## 📁 Project Structure

```
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout + global SEO metadata
│   ├── page.tsx                # Home page
│   ├── about/                  # About page
│   ├── admission/              # Admission enquiry form
│   ├── contact/                # Contact page
│   ├── courses/                # Courses listing
│   ├── gallery/                # Photo gallery
│   ├── notices/                # Notices listing
│   ├── testimonials/           # Testimonials listing
│   ├── login/                  # Admin login
│   ├── profile/                # User profile
│   ├── admin/                  # Admin dashboard (protected)
│   │   ├── layout.tsx          # Server-side auth guard
│   │   ├── page.tsx            # Dashboard with content counts
│   │   ├── courses/            # Course CRUD
│   │   ├── gallery/            # Gallery management
│   │   ├── notices/            # Notice management
│   │   ├── testimonials/       # Testimonial management
│   │   └── settings/           # Settings
│   ├── api/admin/health/       # Protected admin API route
│   ├── robots.ts               # robots.txt
│   └── sitemap.ts              # sitemap.xml
│
├── components/                 # Reusable UI components
│   ├── home/                   # Home page sections
│   ├── ui/                     # Small UI primitives
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── CoursesSection.tsx
│   ├── AdmissionForm.tsx
│   ├── FloatingWhatsApp.tsx
│   └── ...
│
├── hooks/                      # Custom React hooks
│   └── useCourses.ts
│
├── lib/                        # Shared utilities
│   ├── supabase.ts             # Browser Supabase client
│   ├── supabase-server.ts      # Server Supabase client (SSR cookies)
│   ├── auth.ts                 # Server-side auth guards
│   ├── api-auth.ts             # API route auth guard
│   ├── site.ts                 # Academy contact/config constants
│   └── utils.ts
│
├── types/                      # TypeScript types
│   ├── course.ts
│   ├── gallery.ts
│   ├── notice.ts
│   └── testimonial.ts
│
├── public/                     # Static assets (images, favicon, og-image)
├── wrangler.jsonc              # Cloudflare Workers config
├── open-next.config.ts         # OpenNext config
├── proxy.ts                    # Cloudflare proxy config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (or Bun)
- **npm** / **yarn** / **pnpm**
- A **Supabase** project (URL + publishable key)
- A **Cloudflare** account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/RohanMagar7/Elite-English-Academy.git
cd eliteenglishacademy
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
| `courses` | Course listings (title, duration, fees, description, image_url, mode) |
| `gallery` | Gallery images |
| `notices` | Announcements and notices |
| `testimonials` | Student testimonials |
| `admissions` | Admission enquiry form submissions |

**Storage buckets:** `courses` and `gallery` (for image uploads).

**Auth:** Supabase Auth is used for admin login. The admin layout calls `requireAdmin()` on every page load, which validates the JWT server-side and redirects to `/login` if the session is invalid or expired.

> 🔒 **RLS (Row-Level Security):** Client-side database calls require appropriate RLS policies. Do not add code that assumes unrestricted anon database access.

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