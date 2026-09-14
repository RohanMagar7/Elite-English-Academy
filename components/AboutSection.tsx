"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
    "Spoken English",
    "IELTS & PTE Preparation",
    "Grammar & Vocabulary",
    "Personality Development",
];

export default function AboutSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="bg-white py-8 sm:py-10">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1.35fr] lg:px-10 xl:px-14">
                <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
                    className="flex justify-center lg:justify-start"
                >
                    <img
                        src="/hero/teacher-about.png"
                        alt="English trainer"
                        className="h-[420px] w-full max-w-[420px] object-contain sm:h-[500px] lg:h-[560px] lg:max-w-[460px]"
                    />
                </motion.div>

                <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
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
                                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
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
                        <button className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Book Free Demo
                            <ArrowRight size={16} />
                        </button>
                        <span className="text-sm font-medium text-slate-500">
                            Practical learning with confidence-building guidance
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}