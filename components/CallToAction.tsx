/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

export default function CallToAction() {
  const { settings } = useSiteSettings();

  return (
    <section className="py-8 md:py-10">
      {/* Full Width Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#071328] via-[#1D4ED8] to-[#2563EB] px-6 py-7 md:px-10 md:py-8 shadow-[0_20px_50px_rgba(37,99,235,0.30)]">

          {/* Background Glow */}
          <div className="absolute -right-20 top-0 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row">

            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
                Start Today
              </span>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                Ready to Speak English with Confidence?
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                Join Elite English Academy and improve your English speaking with expert trainers and daily practice.
              </p>
            </div>

            {/* Right Buttons */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={whatsappLink(settings.whatsapp_number)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-sm font-bold text-slate-900 transition hover:scale-105 hover:bg-[#FCD34D]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Now
              </Link>

              <Link
                href={settings.phone_href}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:scale-105 hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}