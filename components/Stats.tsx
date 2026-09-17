"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { ArrowUpRight, BookOpen, GraduationCap, Laptop, Sparkles, BadgeCheck, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Stat = { label: string; value: number; suffix?: string | null; icon?: string | null };

const FALLBACK: Stat[] = [
    { label: "Happy Students", value: 500, suffix: "+" },
    { label: "Years Teaching Experience", value: 12, suffix: "+" },
];

const ICONS: Record<string, typeof Sparkles> = { GraduationCap, BookOpen, Laptop, Sparkles, BadgeCheck, Trophy };

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-blue-950 sm:text-4xl"
        >
            {value}
            {suffix}
        </motion.span>
    );
}

export default function Stats() {
    const reduceMotion = useSafeReducedMotion();
    const [stats, setStats] = useState<Stat[]>(FALLBACK);
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from("stats").select("label, value, suffix, icon").eq("is_active", true).order("sort_order");
            if (data && data.length > 0) setStats(data);
        })();
    }, []);

    return (
        <section className="bg-[#F8FBFF] py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map(({ icon, value, suffix, label }) => {
                        const Icon = ICONS[icon || "Sparkles"] || Sparkles;
                        return (
                        <motion.div
                            key={label}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                            className="course-card group"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-secondary">
                                    <Icon size={22} strokeWidth={2.2} />
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-secondary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>

                            <AnimatedNumber value={Number(value)} suffix={suffix || ""} />

                            <p className="mt-3 font-sm font-semibold text-muted sm:text-base">
                                {label}
                            </p>
                        </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
