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
        <section className="relative overflow-hidden bg-[#EFF6FF] text-blue-950" onContextMenu={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_35%)]" />
            <motion.div
                animate={reduceMotion ? { opacity: 0.6 } : { x: [0, 18, 0], y: [0, -12, 0], opacity: [0.5, 0.8, 0.5] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl"
            />
            <motion.div
                animate={reduceMotion ? { opacity: 0.6 } : { x: [0, -18, 0], y: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-10 top-28 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl"
            />
            <motion.div
                animate={reduceMotion ? { opacity: 0.6 } : { x: [0, 12, 0], y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-1/4 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl"
            />

            <div className="relative mx-auto grid min-h-[60vh] max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 lg:min-h-[64vh] lg:grid-cols-2 lg:px-10 xl:px-14">
                <motion.div
                    initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="flex flex-col justify-center"
                >
                    <span className="mb-5 inline-flex w-fit items-center rounded-full border border-yellow-300 bg-yellow-400 px-4 py-1.5 text-xs md:text-sm font-semibold text-blue-950 shadow-sm">
                        {slide.badge || "Admissions Open 2026"}
                    </span>

                    <h1 className="font-hero font-black leading-tight tracking-tight text-blue-950">
                        {slide.title}
                    </h1>

                    <p className="mt-3 max-w-xl font-body leading-relaxed text-slate-600">
                        {slide.description}
                    </p>

                    <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2">
                        <Link
                            href={slide.primary_button_link || "/admission"}
                            className="btn-primary w-full md:w-auto"
                        >
                            {slide.primary_button_text}
                        </Link>

                        <Link
                            href={slide.secondary_button_link || "/courses"}
                            className="btn-secondary w-full md:w-auto"
                        >
                            {slide.secondary_button_text}
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut", delay: reduceMotion ? 0 : 0.1 }}
                    className="relative flex items-center justify-center"
                >
                    <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 blur-2xl opacity-20" />

                    <motion.img
                        src={slide.image_url || "/hero/Teacher-portrait.png"}
                        alt="Teacher at Elite English Academy"
                        animate={reduceMotion ? { y: 0 } : { y: [0, -10, 0] }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full max-w-[540px] object-contain drop-shadow-[0_25px_40px_rgba(37,99,235,0.18)]"
                    />
                </motion.div>
            </div>
        </section>
    );
}