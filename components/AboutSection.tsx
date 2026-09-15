"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";

const features = [
    "Spoken English",
    "IELTS & PTE Preparation",
    "Grammar & Vocabulary",
    "Personality Development",
];

export default function AboutSection() {
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    return (
        <section className="bg-white py-8 sm:py-10">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1.35fr] lg:px-10 xl:px-14">
                <motion.div
                    initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="flex justify-center lg:justify-start"
                >
                    <img
                        src="/hero/teacher-about.png"
                        alt="English trainer"
                        className="h-[420px] w-full max-w-[420px] object-contain sm:h-[500px] lg:h-[560px] lg:max-w-[460px]"
                    />
                </motion.div>

                <motion.div
                    initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                        About Elite English Academy
                    </span>

                    <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
                        Meet Our Expert English Trainer
                    </h2>

                    <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                        At Elite English Academy, we help learners build real confidence through practical communication, strong grammar foundations, and result-driven preparation for speaking, exams, and everyday success.
                    </p>

                    <div className="mt-8 space-y-4">
                        {features.map((feature) => (
                            <motion.div
                                key={feature}
                                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
                                className="flex items-center gap-3 text-base font-medium text-slate-700"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-sm">
                                    <CheckCircle2 size={18} />
                                </span>
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            href="/admission"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Book Free Demo
                            <ArrowRight size={16} />
                        </Link>
                        <span className="text-sm font-medium text-slate-500">
                            Practical learning with confidence-building guidance
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Mission & Vision */}
            <div className="mx-auto mt-14 grid max-w-7xl gap-5 md:grid-cols-2 px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-6 sm:p-8">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2563EB]">
                        Our Mission
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-blue-950">
                        Confident Communicators
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                        To empower every learner with practical speaking skills, a strong
                        English foundation, and the self-confidence to express themselves
                        clearly in academics, careers, and everyday life.
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-[#0B1F4D] p-6 text-white sm:p-8">
                    <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-950">
                        Our Vision
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-white">
                        Lifelong Success
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-blue-100 sm:text-base">
                        To be the region's most trusted English academy — a place where
                        students not only learn English but discover their potential and
                        build careers they can be proud of.
                    </p>
                </div>
            </div>
        </section>
    );
}