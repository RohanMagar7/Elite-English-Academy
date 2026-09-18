/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import Link from "next/link";

/** Generic 404 — no internal paths disclosed. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold text-blue-950">Page not found.</h2>
      <p className="text-slate-600">The page you are looking for does not exist or was moved.</p>
      <Link
        href="/"
        className="rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
