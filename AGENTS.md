<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

**Agent Guidance**

- **Next.js Version:** Use the App Router (Next.js 16.3.x). Consult [node_modules/next/dist/docs/](node_modules/next/dist/docs/) for breaking changes before editing router or rendering code.
- **Start / Build / Lint:** Use `npm run dev` (`next dev`), `npm run build` (`next build`) and `npm run start` (`next start`). Run `npm run lint` to catch style issues. See [package.json](package.json).
- **Routing & Layouts:** Work inside the `app/` router; prefer server components unless a file declares "use client". Root layout: [app/layout.tsx](app/layout.tsx). Admin nested layout: [app/admin/layout.tsx](app/admin/layout.tsx).
- **Supabase & Auth:** `lib/supabase.ts` is a client (anon) Supabase instance using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Do NOT add service_role keys to client code. For server-side admin operations use server-only env vars and server routes or `@supabase/ssr`.
- **Important files:** [app/](app), [components/](components), [lib/supabase.ts](lib/supabase.ts), [lib/auth.ts](lib/auth.ts) (note: currently empty), [tsconfig.json](tsconfig.json), [postcss.config.mjs](postcss.config.mjs).
- **Styling:** Tailwind + PostCSS are used; follow existing utility classes and theme tokens in `globals.css`.
- **Dev hygiene:** Remove debug `console.log` in `lib/supabase.ts` before production. Never commit secrets or `.env` values. Confirm behavior locally with `npm run dev`.
- **Permissions & RLS:** Client DB calls require appropriate RLS policies; avoid adding code that assumes unrestricted anon DB access.
- **Preserve Next header:** Do not remove or alter the Next dev-generated header block above — Next may re-add it.

If you want, I can also add a concise `.github/copilot-instructions.md` or create a small `AGENT.skill.md` with automated tasks (lint/build/test) — tell me which you'd prefer.
