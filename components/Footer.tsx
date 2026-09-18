"use client";

import Link from "next/link";
import { MapPin, Mail, MessageCircle, Phone, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import {
  FOOTER_COURSE_LINKS_FALLBACK,
  FOOTER_QUICK_LINKS_FALLBACK,
} from "@/lib/constants";

type FLink = { label: string; href: string; group_name: string };
type SLink = { platform: string; label: string | null; url: string };

const QUICK_LINKS_FALLBACK: FLink[] = FOOTER_QUICK_LINKS_FALLBACK.map(
  (l) => ({ ...l, group_name: "quick_links" }),
);
const COURSE_LINKS_FALLBACK: FLink[] = FOOTER_COURSE_LINKS_FALLBACK.map(
  (l) => ({ ...l, group_name: "courses" }),
);

async function fetchFooterLinks() {
  return supabase
    .from("footer_links")
    .select("label, href, group_name")
    .eq("is_active", true)
    .order("sort_order");
}

async function fetchSocialLinks() {
  return supabase
    .from("social_links")
    .select("platform, label, url")
    .eq("is_active", true)
    .order("sort_order");
}

const SOCIAL_ICON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-blue-100 transition hover:bg-blue-900 hover:text-white";

export default function Footer() {
  const { settings } = useSiteSettings();

  const { data: footerLinks } = useSupabaseQuery<FLink>(fetchFooterLinks);
  const { data: socials } = useSupabaseQuery<SLink>(fetchSocialLinks);

  const quickLinks =
    footerLinks.filter((l) => l.group_name === "quick_links").length > 0
      ? footerLinks.filter((l) => l.group_name === "quick_links")
      : QUICK_LINKS_FALLBACK;
  const courseLinks =
    footerLinks.filter((l) => l.group_name === "courses").length > 0
      ? footerLinks.filter((l) => l.group_name === "courses")
      : COURSE_LINKS_FALLBACK;

  return (
    <footer className="bg-[#0B1F4D] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 xl:px-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-black text-blue-200">
                E
              </div>
              <div>
                <p className="font-card font-black tracking-tight text-white">
                  {settings.academy_name}
                </p>
                <p className="text-xs tracking-wide text-blue-200 sm:text-sm">
                  {settings.tagline}
                </p>
              </div>
            </div>

            <p className="mt-5 font-body text-blue-100 sm:text-lg">
              {settings.footer_about || settings.tagline}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {socials.length > 0 ? (
                socials.map((s) => (
                  <a
                    key={s.platform + s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label || s.platform}
                    className={SOCIAL_ICON_CLASS}
                  >
                    <Globe className="h-4 w-4" aria-hidden />
                  </a>
                ))
              ) : (
                <a
                  href={whatsappLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className={SOCIAL_ICON_CLASS}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h3 className="font-card font-bold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Courses */}
          <nav aria-label="Courses">
            <h3 className="font-card font-bold text-white">Courses</h3>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              {courseLinks.map((course) => (
                <li key={course.label}>
                  <Link href={course.href} className="transition hover:text-white">
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-card font-bold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-200" aria-hidden />
                <span className="font-body text-blue-100">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-200" aria-hidden />
                <a
                  href={settings.phone_href}
                  className="font-body font-medium text-blue-100 hover:text-white"
                >
                  {settings.phone_display}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-200" aria-hidden />
                <a
                  href={`mailto:${settings.email}`}
                  className="font-body font-medium text-blue-100 hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-blue-200">
            © 2026 {settings.academy_name}. {settings.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
