"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";

type HeroSlide = {
    badge?: string | null; title: string; description?: string | null;
    image_url?: string | null; primary_button_text?: string | null;
    primary_button_link?: string | null; secondary_button_text?: string | null;
    secondary_button_link?: string | null;
};

const DEFAULT_HERO: HeroSlide = {
    badge: "Admissions Open 2026",
    title: "Speak English with Confidence. Build Your Future.",
    description: "Master Spoken English, IELTS preparation, grammar foundations, and practical communication skills.",
    image_url: "/hero/Teacher-portrait.png",
    primary_button_text: "Free Demo Class", primary_button_link: "/admission",
    secondary_button_text: "View Courses", secondary_button_link: "/courses",
};

export default function Hero() {
    const reduceMotion = useSafeReducedMotion();
    const [slide, setSlide] = useState<HeroSlide>(DEFAULT_HERO);
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from("hero_slides").select("*").eq("is_active", true).order("sort_order").limit(1);
            if (data && data.length > 0) setSlide({ ...DEFAULT_HERO, ...data[0] });
        })();
    }, []);

    return (
        <section className="relative overflow-hidden pt-12 pb-20" onContextMenu={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="grid gap-12 items-center lg:grid-cols-12">
                    {/* Content Column */}
                    <motion.div
                        initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7"
                    >
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="badge-gold -rotate-2 text-sm">
                                    <span className="relative mr-2 flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-marker opacity-75 animate-ping"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-marker"></span>
                                    </span>
                                    {slide.badge || "Admissions Open 2026"}
                                </span>
                            </motion.div>

                            <h1 className="font-hero text-pencil">
                                {slide.title.split('. ').map((part, i) => (
                                    <span key={i} className="block">
                                        {part}{i === 0 ? '.' : ''}
                                        {i === slide.title.split('. ').length - 1 && (
                                            <span className="inline-block text-marker rotate-6 animate-bounce [animation-duration:3s]">!</span>
                                        )}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-lg md:text-xl text-pencil/80 leading-relaxed max-w-2xl">
                                {slide.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <Link
                                    href={slide.primary_button_link || "/admission"}
                                    className="btn-gold !h-14 px-10 text-lg md:text-2xl group"
                                >
                                    {slide.primary_button_text}
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="ml-2"
                                    >→</motion.span>
                                </Link>

                                <Link
                                    href={slide.secondary_button_link || "/courses"}
                                    className="btn-secondary !h-14 px-10 text-lg"
                                >
                                    {slide.secondary_button_text}
                                </Link>

                                {/* Hand-drawn arrow pointing to the CTA (desktop only) */}
                                <svg
                                    className="hidden md:block h-12 w-24 -rotate-12 text-ballpoint"
                                    viewBox="0 0 100 50"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M95 8 C 70 4, 40 12, 12 34"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="7 6"
                                    />
                                    <path
                                        d="M22 22 L 11 35 L 28 38"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Trust Badge / Mini Stats */}
                            <div className="pt-8 flex items-center gap-6 border-t-2 border-dashed border-erased">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 w-10 overflow-hidden border-2 border-pencil bg-erased" style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}>
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" />
                                        </div>
                                    ))}
                                    <div className="h-10 w-10 border-2 border-pencil bg-ballpoint flex items-center justify-center text-[10px] font-bold text-white" style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}>
                                        500+
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-pencil">Trusted by 500+ Students</p>
                                    <div className="flex text-marker">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Column — taped polaroid with corner frame marks */}
                    <motion.div
                        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="relative lg:col-span-5"
                    >
                        {/* Bouncing decorative scribble circle (desktop only) */}
                        <div className="absolute -top-8 -left-8 hidden md:flex h-14 w-14 animate-bounce items-center justify-center [animation-duration:3s]" aria-hidden="true">
                            <svg viewBox="0 0 50 50" fill="none" className="h-14 w-14 text-marker">
                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />
                            </svg>
                        </div>

                        <div
                            className="relative z-10 overflow-hidden border-[3px] border-pencil bg-white aspect-[4/5] -rotate-1 shadow-[8px_8px_0px_0px_#2d2d2d]"
                            style={{ borderRadius: "15px 155px 15px 155px / 155px 15px 155px 15px" }}
                        >
                            <img
                                src={slide.image_url || "/hero/Teacher-portrait.png"}
                                alt="Elite English Academy"
                                className="w-full h-full object-cover object-top"
                            />

                            {/* Corner frame marks */}
                            <svg className="pointer-events-none absolute inset-0 h-full w-full text-pencil/60" viewBox="0 0 60 90" preserveAspectRatio="none" fill="none" aria-hidden="true">
                                <path d="M12 28 L12 10 L30 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                <path d="M40 10 L58 10 L58 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="translate(-20 0)" />
                                <path d="M12 62 L12 80 L30 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                <path d="M38 80 L56 80 L56 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="translate(-20 0)" />
                            </svg>

                            {/* Tape strip on top */}
                            <div className="absolute -top-3 left-1/2 z-20 h-7 w-28 -translate-x-1/2 rotate-2 bg-erased/80 border border-pencil/20" aria-hidden="true" />

                            {/* Floating Card — taped note */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="glass-card absolute bottom-8 left-10 hidden max-w-[200px] rotate-2 p-5 md:block"
                            >
                                <p className="font-display text-sm font-bold text-pencil">🏆 Top Rated</p>
                                <p className="text-sm text-pencil/80">#1 Academy in the region</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}