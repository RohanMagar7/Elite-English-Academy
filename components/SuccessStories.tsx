"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trophy, Award, Users } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
import SectionHeading from "@/components/home/SectionHeading";

interface SuccessStory {
    id: string;
    student_name: string;
    course: string;
    before_result?: string | null;
    after_result?: string | null;
    achievement?: string | null;
    badge?: string | null;
    is_active?: boolean;
}

const DEFAULT_STORIES: SuccessStory[] = [
    {
        id: "s1",
        student_name: "Rohit S.",
        course: "Spoken English",
        before_result: "Struggled to speak in English in interviews & daily life",
        after_result: "Confidently handles interviews & presentations",
        achievement: "Selected for a BPO role",
        badge: "Placement Success",
    },
    {
        id: "s2",
        student_name: "Priya D.",
        course: "IELTS Preparation",
        before_result: "Band 4.5 in mock tests",
        after_result: "Scored Band 7.5 in final IELTS",
        achievement: "Secured admission abroad",
        badge: "IELTS 7.5",
    },
    {
        id: "s3",
        student_name: "Amit K.",
        course: "Grammar & Vocabulary",
        before_result: "Lacked grammar foundation & confidence",
        after_result: "Fluent in written and spoken English",
        achievement: "Improved marks in board exams",
        badge: "Top Performer",
    },
];

const STATS = [
    { icon: Users, value: 500, suffix: "+", label: "Students Trained" },
    { icon: Award, value: 100, suffix: "+", label: "IELTS Candidates" },
    { icon: TrendingUp, value: 4.9, suffix: "/5", label: "Average Rating", decimal: true },
    { icon: Trophy, value: 12, suffix: "+", label: "Years of Excellence" },
];

function AnimatedStat({
    value,
    suffix,
    label,
    decimal,
    index,
}: {
    value: number;
    suffix: string;
    label: string;
    decimal?: boolean;
    index: number;
}) {
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.06 }}
            className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-[0_18px_50px_rgba(37,99,235,0.06)]"
        >
            <p className="text-3xl font-black text-blue-700 sm:text-4xl">
                {decimal ? value.toFixed(1) : value}
                <span className="text-yellow-400">{suffix}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
        </motion.div>
    );
}

export default function SuccessStories() {
    const [stories, setStories] = useState<SuccessStory[]>(DEFAULT_STORIES);
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("success_stories")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(6);

            if (!error && data && data.length > 0) {
                setStories(data);
            }
        }

        load();
    }, []);

    return (
        <section className="bg-[#F8FBFF] py-6 sm:py-8" id="success-stories">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <SectionHeading
                    eyebrow="Success Stories"
                    title="Real Students. Real Results."
                    description="Shy speakers became confident speakers. Read how our students built a better future."
                />

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {STATS.map((stat, index) => (
                        <AnimatedStat key={stat.label} {...stat} index={index} />
                    ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id || `${story.student_name}-${index}`}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: reduceMotion ? 0 : 0.45,
                                delay: reduceMotion ? 0 : index * 0.05,
                            }}
                            whileHover={!reduceMotion ? { y: -5 } : undefined}
                            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_18px_50px_rgba(37,99,235,0.06)]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-950">
                                        {story.student_name}
                                    </h3>
                                    <p className="text-sm font-semibold text-blue-700">
                                        {story.course}
                                    </p>
                                </div>
                                {story.badge ? (
                                    <span className="badge-sm badge-gold rounded-full bg-yellow-400 px-3 py-1 text-blue-950">
                                        {story.badge}
                                    </span>
                                ) : null}
                            </div>

                            <div className="grid-equal-height">
                                <div className="h-full flex flex-col justify-between rounded-xl p-4 bg-blue-50 border border-blue-100">
                                    <p className="badge-text font-bold uppercase tracking-wide text-secondary">
                                        Before
                                    </p>
                                    <p className="mt-1 font-body text-muted">
                                        {story.before_result || "Before joining"}
                                    </p>
                                </div>
                                <div className="h-full flex flex-col justify-between rounded-xl p-4 bg-green-50 border border-green-100">
                                    <p className="badge-text font-bold uppercase tracking-wide text-success">
                                        After
                                    </p>
                                    <p className="mt-1 font-body text-muted">
                                        {story.after_result || "After completing"}
                                    </p>
                                </div>
                            </div>

                            {story.achievement ? (
                                <p className="mt-4 pt-3 border-t border-blue-100 flex items-center gap-2 font-semibold text-primary">
                                    <Trophy className="h-4 w-4 text-yellow-400" />
                                    {story.achievement}
                                </p>
                            ) : null}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}