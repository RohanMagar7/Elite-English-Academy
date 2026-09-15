"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { academy } from "@/lib/site";

const featureBadges = [
    "Online & Offline Batches",
    "Small Batch Size",
];

export default function Hero() {
    // SSR-safe: returns false during SSR + first client render, then syncs
    // with the real OS reduced-motion setting after mount (via useEffect),
    // so server and first-client markup always match.
    const reduceMotion = useSafeReducedMotion();

    return (
        <section className="relative overflow-hidden bg-[#EFF6FF] text-slate-900">
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

            <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:min-h-[78vh] lg:grid-cols-2 lg:px-10 xl:px-14">
                <motion.div
                    initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="flex flex-col justify-center"
                >
                    <span className="mb-5 inline-flex w-fit items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm">
                        Admissions Open 2026
                    </span>

                    <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-blue-950 sm:text-4xl lg:text-5xl xl:text-6xl">
                        Speak English with Confidence. Build Your Future.
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base lg:text-lg">
                        Master Spoken English, IELTS preparation, grammar foundations, and practical communication skills with expert-led training designed for real-world success.
                    </p>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/admission"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#2563EB] px-6 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                        >
                            Free Demo Class
                        </Link>

                        <Link
                            href="/courses"
                            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-blue-600 bg-white px-6 text-base font-semibold text-[#2563EB] transition hover:bg-blue-50"
                        >
                            View Courses
                        </Link>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                            href={`${academy.whatsappHref}?text=${encodeURIComponent(academy.whatsappMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp Us
                        </a>

                        <a
                            href={academy.phoneHref}
                            className="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-100"
                        >
                            <Phone className="h-4 w-4" />
                            Call {academy.phoneDisplay}
                        </a>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {featureBadges.map((badge) => (
                            <span
                                key={badge}
                                className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-200"
                            >
                                {badge}
                            </span>
                        ))}
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
                        src="/hero/Teacher-portrait.png"
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