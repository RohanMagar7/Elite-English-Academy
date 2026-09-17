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
        <section className="relative overflow-hidden bg-white pt-12 pb-20" onContextMenu={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,_rgba(30,58,138,0.08),_transparent_50%),radial-gradient(circle_at_0%_100%,_rgba(251,191,36,0.05),_transparent_50%)]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
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
                                <span className="badge-gold">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo"></span>
                                    </span>
                                    {slide.badge || "Admissions Open 2026"}
                                </span>
                            </motion.div>

                            <h1 className="font-hero text-brand-indigo">
                                {slide.title.split('. ').map((part, i) => (
                                    <span key={i} className="block">
                                        {part}{i === 0 ? '.' : ''}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                                {slide.description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href={slide.primary_button_link || "/admission"}
                                    className="btn-gold !h-14 px-10 text-lg group"
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
                            </div>

                            {/* Trust Badge / Mini Stats */}
                            <div className="pt-8 flex items-center gap-6 border-t border-slate-100">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" />
                                        </div>
                                    ))}
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-brand-blue flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        500+
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-brand-indigo">Trusted by 500+ Students</p>
                                    <div className="flex text-brand-gold">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Column - Bento Style */}
                    <motion.div
                        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-blue/20 bg-brand-blue aspect-[4/5]">
                            <img
                                src={slide.image_url || "/hero/Teacher-portrait.png"}
                                alt="Elite English Academy"
                                className="w-full h-full object-cover object-top"
                            />

                            {/* Floating Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute bottom-8 left-10 glass-card p-6 rounded-3xl hidden md:block max-w-[200px]"
                            >
                                <div className="bg-brand-gold/20 h-10 w-10 rounded-xl flex items-center justify-center mb-3">
                                    <span className="text-xl">🏆</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wider text-brand-indigo mb-1">Top Rated</p>
                                <p className="text-sm font-medium text-slate-700">#1 Academy in the region</p>
                            </motion.div>
                        </div>

                        {/* Decorative background shapes */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}