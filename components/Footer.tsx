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
        "group/link inline-flex items-center gap-1.5 text-sm font-bold text-paper/80 transition-all duration-100 hover:text-paper hover:line-through hover:decoration-marker hover:decoration-2";

    return (
        <footer className="relative overflow-hidden bg-pencil text-paper">
            {/* Hand-drawn squiggle divider along the top */}
            <svg className="block w-full text-erased" viewBox="0 0 1200 20" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 12 Q 25 2, 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12 T 450 12 T 500 12 T 550 12 T 600 12 T 650 12 T 700 12 T 750 12 T 800 12 T 850 12 T 900 12 T 950 12 T 1000 12 T 1050 12 T 1100 12 T 1150 12 T 1200 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 xl:px-14">
                {/* Top CTA row — taped note */}
                <div className="relative mb-12 -rotate-1 border-[3px] border-dashed border-paper/50 bg-white/5 p-6 sm:flex-row sm:items-center sm:p-8 flex flex-col items-start justify-between gap-5">
                    <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 border border-paper/20 bg-erased/70" aria-hidden="true" />
                    <div>
                        <p className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                            Ready to speak English with confidence?
                        </p>
                        <p className="mt-1 text-sm text-paper/70">
                            Admissions are open — book a free demo class today.
                        </p>
                    </div>
                    <Link
                        href="/admission"
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border-[3px] border-paper bg-postit px-7 font-bold text-pencil transition-transform duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                        style={{ borderRadius: "var(--wobbly)", boxShadow: "4px 4px 0px 0px rgba(253,251,247,0.9)" }}
                    >
                        Apply for Admission
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                    </Link>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center border-2 border-paper bg-postit font-display text-xl font-bold text-pencil" style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}>
                                <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="font-display text-lg font-bold tracking-tight text-paper">{settings.academy_name}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-marker">{settings.tagline}</p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-paper/80 sm:text-[15px]">{settings.footer_about || settings.tagline}</p>

                        <div className="mt-5 flex items-center gap-3">
                            {(socials.length > 0
                                ? socials.map((s) => (
                                    <a key={s.platform + s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label || s.platform}
                                        className="flex h-10 w-10 items-center justify-center border-2 border-paper/60 text-paper/80 transition-transform duration-100 hover:-rotate-6 hover:bg-postit hover:text-pencil"
                                        style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}>
                                        <Globe className="h-4 w-4" strokeWidth={2.5} />
                                    </a>
                                ))
                                : (
                                    <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                                        className="flex h-10 w-10 items-center justify-center border-2 border-paper/60 text-paper/80 transition-transform duration-100 hover:-rotate-6 hover:bg-postit hover:text-pencil"
                                        style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}>
                                        <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                                    </a>
                                ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-paper">
                            Quick Links
                            <span className="h-px flex-1 border-b-2 border-dashed border-paper/40" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {qLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={linkBase}>
                                        <span className="h-1 w-1 rounded-full bg-marker/70 transition group-hover/link:bg-marker" aria-hidden="true" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-paper">
                            Courses
                            <span className="h-px flex-1 border-b-2 border-dashed border-paper/40" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {cLinks.map((course) => (
                                <li key={course.label}>
                                    <Link href={course.href} className={linkBase}>
                                        <span className="h-1 w-1 rounded-full bg-marker/70 transition group-hover/link:bg-marker" aria-hidden="true" />
                                        {course.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-paper">
                            Contact
                            <span className="h-px flex-1 border-b-2 border-dashed border-paper/40" aria-hidden="true" />
                        </h3>
                        <ul className="mt-4 space-y-3.5 text-sm">
                            <li className="flex items-start gap-3 text-paper/80">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-marker" aria-hidden="true" />
                                <span className="leading-6">{settings.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-marker" aria-hidden="true" />
                                <a href={settings.phone_href} className="font-medium text-paper/80 transition hover:text-white">{settings.phone_display}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-marker" aria-hidden="true" />
                                <a href={`mailto:${settings.email}`} className="break-all font-medium text-paper/80 transition hover:text-white">{settings.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-2 border-t-2 border-dashed border-paper/30 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-center text-xs text-paper/70 sm:text-sm">
                        © 2026 {settings.academy_name}. {settings.copyright_text}
                    </p>
                    <p className="text-xs text-paper/50">
                        Speak English with Confidence.
                    </p>
                </div>
            </div>
        </footer>
    );
}
