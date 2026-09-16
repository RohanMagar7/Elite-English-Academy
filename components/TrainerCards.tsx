"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, Award } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SectionHeading from "@/components/home/SectionHeading";

interface Trainer {
    id: string;
    name: string;
    qualification: string;
    experience: string;
    specialization: string;
    photo_url?: string | null;
    role?: string | null;
    is_active?: boolean;
}

const DEFAULT_TRAINERS: Trainer[] = [
    {
        id: "trainer-1",
        name: "Prof. J. M. Wagh-Dhotre",
        qualification: "M.A. English | MH-SET",
        experience: "12+ Years of Teaching Experience",
        specialization: "Spoken English • IELTS • Grammar • Teacher Training",
        role: "Founder & Principal Trainer",
        photo_url: "/hero/Teacher-portrait.png",
    },
];

export default function TrainerCards() {
    const [trainers, setTrainers] = useState<Trainer[]>(DEFAULT_TRAINERS);
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("trainers")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: true })
                .limit(6);

            if (!error && data && data.length > 0) {
                setTrainers(data);
            }
        }

        load();
    }, []);

    const fallbackPhoto = (name: string) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Trainer")}&background=2563EB&color=fff`;

    return (
        <section className="bg-white py-8 sm:py-10" id="trainers">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <SectionHeading
                    eyebrow="Our Trainers"
                    title="Learn From Experienced Faculty"
                    description="Meet the mentors who guide our students toward confident communication and lasting success."
                />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {trainers.map((trainer, index) => (
                        <motion.div
                            key={trainer.id || `${trainer.name}-${index}`}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: reduceMotion ? 0 : 0.45,
                                delay: reduceMotion ? 0 : index * 0.07,
                            }}
                            whileHover={!reduceMotion ? { y: -6 } : undefined}
                            className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.07)] transition-all duration-300"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-blue-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={trainer.photo_url || fallbackPhoto(trainer.name)}
                                    alt={trainer.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 to-transparent p-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-950">
                                        <BadgeCheck className="h-3 w-3" />
                                        {trainer.role || "Faculty"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-blue-950 sm:text-xl">
                                    {trainer.name}
                                </h3>

                                <div className="mt-3 space-y-2 text-sm text-slate-600">
                                    <p className="flex items-start gap-2">
                                        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                                        {trainer.qualification}
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <Award className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                                        {trainer.experience}
                                    </p>
                                </div>

                                {trainer.specialization ? (
                                    <p className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs font-medium leading-5 text-blue-800">
                                        <span className="font-bold">Specialization:</span>{" "}
                                        {trainer.specialization}
                                    </p>
                                ) : null}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Guided by our expert faculty
                </p>
            </div>
        </section>
    );
}