"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import {
    BadgeCheck,
    BookOpen,
    BriefcaseBusiness,
    GraduationCap,
    Laptop2,
    MessageSquareMore,
} from "lucide-react";

const features = [
    {
        icon: MessageSquareMore,
        title: "Daily Speaking Practice",
        text: "Build real confidence through guided speaking drills and practical conversation routines.",
    },
    {
        icon: GraduationCap,
        title: "Small Batch Size",
        text: "Get personal attention and focused mentorship in a supportive learning environment.",
    },
    {
        icon: BookOpen,
        title: "Weekly Assessments",
        text: "Track your progress with structured evaluations and targeted feedback every week.",
    },
    {
        icon: BriefcaseBusiness,
        title: "Modern Study Material",
        text: "Access updated resources designed for interviews, exams, and everyday communication.",
    },
    {
        icon: BadgeCheck,
        title: "Certificate After Completion",
        text: "Earn a recognized certificate that reflects your growth and commitment to learning.",
    },
    {
        icon: Laptop2,
        title: "Online & Offline Classes",
        text: "Choose the learning mode that fits your schedule without compromising quality.",
    },
];

export default function WhyChooseUs() {
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    return (
        <section className="bg-[#F8FBFF] py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="mb-10 text-center">
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                        Why Choose Us
                    </span>
                    <h2 className="mt-5 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                        Why Choose Elite English Academy
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {features.map(({ icon: Icon, title, text }, index) => (
                        <motion.div
                            key={title}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut", delay: reduceMotion ? 0 : index * 0.05 }}
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.05)] transition-all duration-300"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                                <Icon size={25} strokeWidth={2.2} />
                            </div>

                            <h3 className="text-xl font-bold text-blue-950">{title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                                {text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
