"use client";

import Link from "next/link";
import { MapPin, Mail, MessageCircle, Phone, Globe, GraduationCap, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

type FLink = { label: string; href: string; group_name: string };
type SLink = { platform: string; label: string | null; url: string };

export default function Footer() {
    const { settings } = useSiteSettings();
    const [quickLinks, setQuickLinks] = useState<FLink[]>([]);
    const [courseLinks, setCourseLinks] = useState<FLink[]>([]);
    const [socials, setSocials] = useState<SLink[]>([]);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.from("footer_links").select("label, href, group_name").eq("is_active", true).order("sort_order");
            if (data && data.length > 0) {
                setQuickLinks(data.filter((r: FLink) => r.group_name === "quick_links"));
                setCourseLinks(data.filter((r: FLink) => r.group_name === "courses"));
            }
        })();
        (async () => {
            const { data } = await supabase.from("social_links").select("platform, label, url").eq("is_active", true).order("sort_order");
            if (data && data.length > 0) setSocials(data);
        })();
    }, []);

    const qLinks = quickLinks.length > 0 ? quickLinks : [
        { label: "About Us", href: "/about", group_name: "quick_links" },
        { label: "Courses", href: "/courses", group_name: "quick_links" },
        { label: "Gallery", href: "/gallery", group_name: "quick_links" },
        { label: "Admission", href: "/admission", group_name: "quick_links" },
        { label: "Contact", href: "/contact", group_name: "quick_links" },
    ];
    const cLinks = courseLinks.length > 0 ? courseLinks : [
        { label: "Spoken English", href: "/courses", group_name: "courses" },
        { label: "IELTS Preparation", href: "/courses", group_name: "courses" },
    ];

    const linkBase =
        "group/link inline-flex items-center gap-1.5 text-sm font-medium text-blue-200/90 transition-all duration-300 hover:text-white hover:translate-x-0.5";

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#0B1F4D] via-[#0B1F4D] to-[#071A49] text-white">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 xl:px-14">
                {/* Top CTA row */}
                <div className="mb-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                            Ready to speak English with confidence?
                        </p>
                        <p className="mt-1 text-sm text-blue-200">
                            Admissions are open — book a free demo class today.
                        </p>
                    </div>
                    <Link
                        href="/admission"
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-gold px-7 font-bold text-[#1a1405] shadow-lg shadow-brand-gold/25 transition-all duration-300 hover:scale-[1.03] hover:brightness-105 active:scale-95"
                    >
                        Apply for Admission
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-gold to-amber-500 font-display text-xl font-black text-[#1a1405] shadow-lg shadow-brand-gold/20">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-display text-lg font-black tracking-tight text-white">{settings.academy_name}</p>
                                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{settings.tagline}</p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-blue-200/90 sm:text-[15px]">{settings.footer_about || settings.tagline}</p>

                        <div className="mt-5 flex items-center gap-3">
                            {(socials.length > 0
                                ? socials.map((s) => (
                                    <a key={s.platform + s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label || s.platform}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-blue-100 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-brand-gold/50 hover:bg-brand-gold hover:text-[#1a1405]">
                                        <Globe className="h-4 w-4" />
                                    </a>
                                ))
                                : (
                                    <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-blue-100 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-brand-gold/50 hover:bg-brand-gold hover:text-[#1a1405]">
                                        <MessageCircle className="h-4 w-4" />
                                    </a>
                                ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-white">
                            Quick Links
                            <span className="h-px flex-1 bg-gradient-to-r from-brand-gold/50 to-transparent" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {qLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={linkBase}>
                                        <span className="h-1 w-1 rounded-full bg-brand-gold/60 transition group-hover/link:bg-brand-gold" aria-hidden="true" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-white">
                            Courses
                            <span className="h-px flex-1 bg-gradient-to-r from-brand-gold/50 to-transparent" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {cLinks.map((course) => (
                                <li key={course.label}>
                                    <Link href={course.href} className={linkBase}>
                                        <span className="h-1 w-1 rounded-full bg-brand-gold/60 transition group-hover/link:bg-brand-gold" aria-hidden="true" />
                                        {course.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-white">
                            Contact
                            <span className="h-px flex-1 bg-gradient-to-r from-brand-gold/50 to-transparent" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-3.5 text-sm">
                            <li className="flex items-start gap-3 text-blue-200/90">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                                <span className="leading-6">{settings.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                                <a href={settings.phone_href} className="font-medium text-blue-200/90 transition hover:text-white">{settings.phone_display}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                                <a href={`mailto:${settings.email}`} className="break-all font-medium text-blue-200/90 transition hover:text-white">{settings.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-center text-xs text-blue-300/80 sm:text-sm">
                        © 2026 {settings.academy_name}. {settings.copyright_text}
                    </p>
                    <p className="text-xs text-blue-300/60">
                        Speak English with Confidence.
                    </p>
                </div>
            </div>
        </footer>
    );
}
