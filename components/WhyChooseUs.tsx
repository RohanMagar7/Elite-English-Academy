"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { BadgeCheck, BookOpen, Briefcase, GraduationCap, Laptop, MessageSquare, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Feature = { title: string; description?: string | null; icon?: string | null };

const FALLBACK: Feature[] = [
    { title: "Daily Speaking Practice", description: "Build real confidence." },
    { title: "Small Batch Size", description: "Personal attention." },
];

const ICONS: Record<string, typeof Sparkles> = { BadgeCheck, BookOpen, Briefcase, GraduationCap, Laptop, MessageSquare, Sparkles };

export default function WhyChooseUs() {
    const reduceMotion = useSafeReducedMotion();
    const [features, setFeatures] = useState<Feature[]>(FALLBACK);
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from("features").select("title, description, icon").eq("section_slug", "why-choose-us").eq("is_active", true).order("sort_order");
            if (data && data.length > 0) setFeatures(data);
        })();
    }, []);

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
                    {features.map(({ icon, title, description }, index) => {
                        const Icon = ICONS[icon || "BadgeCheck"] || BadgeCheck;
                        return (
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
                                {description}
                            </p>
                        </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
