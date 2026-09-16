"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, CloudSun, GraduationCap } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
import SectionHeading from "@/components/home/SectionHeading";

interface Batch {
    id: string;
    name: string;
    time: string;
    days: string;
    level: string;
    mode: string;
    description?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

const DEFAULT_BATCHES: Batch[] = [
    {
        id: "morning",
        name: "Morning",
        time: "7:00 AM – 10:00 AM",
        days: "Mon – Sat",
        level: "School Students",
        mode: "Offline",
        description: "Start your day with energetic speaking drills and grammar basics.",
    },
    {
        id: "afternoon",
        name: "Afternoon",
        time: "12:00 PM – 2:30 PM",
        days: "Mon – Fri",
        level: "College Students",
        mode: "Offline",
        description: "Convenient sessions for students finishing college lectures.",
    },
    {
        id: "evening",
        name: "Evening",
        time: "5:00 PM – 9:00 PM",
        days: "Mon – Sat",
        level: "Professionals & All",
        mode: "Offline & Online",
        description: "Flexible evening batches for working professionals and everyone.",
    },
    {
        id: "weekend",
        name: "Weekend",
        time: "Saturday & Sunday",
        days: "Weekend Special",
        level: "Working Professionals",
        mode: "Online",
        description: "Intensive weekend batches for learners with busy weekdays.",
    },
];

const iconMap = [GraduationCap, CloudSun, Clock, CalendarDays];

export default function BatchTimings() {
    const [batches, setBatches] = useState<Batch[]>(DEFAULT_BATCHES);
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("batches")
                .select("*")
                .order("sort_order", { ascending: true });

            if (!error && data && data.length > 0) {
                setBatches(data);
            }
        }

        load();
    }, []);

    return (
        <section className="bg-[#F8FBFF] py-8 sm:py-10" id="batches">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <SectionHeading
                    eyebrow="Batch Timings"
                    title="Flexible Batches for Every Schedule"
                    description="Choose the batch that fits your routine — morning, afternoon, evening, or weekend."
                />

                <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {batches.map((batch, index) => {
                        const Icon =
                            iconMap[index % iconMap.length] ?? GraduationCap;

                        return (
                            <motion.div
                                key={batch.id || `${batch.name}-${index}`}
                                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.45,
                                    delay: reduceMotion ? 0 : index * 0.06,
                                    ease: "easeOut",
                                }}
                                whileHover={!reduceMotion ? { y: -6 } : undefined}
                                className="group flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.06)] transition-all duration-300"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                                    <Icon size={26} strokeWidth={2.2} />
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-xl font-bold text-blue-950">
                                        {batch.name}
                                    </h3>
                                    <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-950">
                                        {batch.mode}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <p className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#2563EB]" />
                                        <span className="font-semibold">{batch.time}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-[#2563EB]" />
                                        {batch.days}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-[#2563EB]" />
                                        {batch.level}
                                    </p>
                                </div>

                                {batch.description ? (
                                    <p className="mt-4 text-sm leading-6 text-slate-500">
                                        {batch.description}
                                    </p>
                                ) : null}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}