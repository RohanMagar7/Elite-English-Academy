"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";

const aboutContent = {
    eyebrow: "About Elite English Academy",
    title: "Meet Our Expert English Trainer",
    description:
        "We help you speak English with real confidence. You get daily speaking practice, clear grammar lessons, and strong support for exams, work, and daily life.",
    image: "/hero/teacher-about.png",
    buttonText: "Book Free Demo",
    buttonLink: "/admission",
};

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
        <section className="bg-white py-6 sm:py-8">
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_1.35fr] lg:px-10 xl:px-14">
                <motion.div
                    initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="flex justify-center lg:justify-start"
                >
                    <img
                        src={aboutContent.image}
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
                    <span className="badge-text inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-secondary">
                        {aboutContent.eyebrow}
                    </span>

                    <h2 className="mt-3 font-section font-black text-primary sm:text-4xl lg:text-5xl">
                        {aboutContent.title}
                    </h2>

                    <p className="mt-3 max-w-xl font-body text-muted sm:text-lg">
                        {aboutContent.description}
                    </p>

                    <div className="mt-4 space-y-2">
                        {features.map((feature) => (
                            <motion.div
                                key={feature}
                                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
                                className="flex items-center gap-3 text-base font-medium text-slate-600"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-sm">
                                    <CheckCircle2 size={18} />
                                </span>
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                                                <Link
                            href={aboutContent.buttonLink}
                            className="btn-primary"
                        >
                            {aboutContent.buttonText}
                            <ArrowRight size={16} />
                        </Link>
                        <span className="text-sm font-medium text-slate-600">
                            Practical learning with confidence-building guidance
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Mission & Vision */}
            <div className="mx-auto mt-6 grid max-w-7xl gap-5 md:grid-cols-2 px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-5 sm:p-6">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                        Our Mission
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-blue-950">
                        Confident Communicators
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                        We help every learner speak with ease. You build
                        strong English basics and the confidence to use them
                        in class, at work, and in daily life.
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-[#0B1F4D] p-6 text-white sm:p-8">
                    <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-950">
                        Our Vision
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-white">
                        Lifelong Success
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
                        We aim to be the most trusted English academy in the
                        region. Here you learn English, find your strengths,
                        and build a career you can be proud of.
                    </p>
                </div>
            </div>
        </section>
    );
}