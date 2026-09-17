"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, Award } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
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
  const reduceMotion = useSafeReducedMotion();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(6);

      if (!error && data?.length) setTrainers(data);
    }

    load();
  }, []);

  const fallbackPhoto = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Trainer"
    )}&background=2563EB&color=fff`;

  return (
    <section id="trainers" className="bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Trainers"
          title="Learn From Experienced Faculty"
          description="Meet our mentors who help you speak confidently and build your career."
        />

        {/* Trainer Cards */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id || `${trainer.name}-${index}`}
              initial={
                reduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 18 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="group overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
            >
              {/* Trainer Image */}
              <div className="relative aspect-[4/4] overflow-hidden bg-blue-50">
                <img
                  src={trainer.photo_url || fallbackPhoto(trainer.name)}
                  alt={trainer.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Role Badge */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 to-transparent p-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-blue-950">
                    <BadgeCheck className="h-3 w-3" />
                    {trainer.role || "Faculty"}
                  </span>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-3">
                <h3 className="text-base font-bold leading-tight text-blue-950">
                  {trainer.name}
                </h3>

                <div className="mt-2 space-y-1.5 text-[13px] leading-5 text-slate-600">
                  <p className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                    {trainer.qualification}
                  </p>

                  <p className="flex items-start gap-2">
                    <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
                    {trainer.experience}
                  </p>
                </div>

                {trainer.specialization && (
                  <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5">
                    <p className="text-[11px] font-semibold text-blue-700">
                      Specialization
                    </p>
                    <p className="mt-0.5 text-[12px] leading-5 text-blue-950">
                      {trainer.specialization}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Text */}
        <p className="mt-3 text-center text-xs text-slate-600">
          Guided by experienced trainers with practical teaching methods.
        </p>
      </div>
    </section>
  );
}