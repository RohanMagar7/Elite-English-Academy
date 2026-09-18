/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  GraduationCap,
  Laptop,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Feature = {
  title: string;
  description?: string | null;
  icon?: string | null;
};

const FALLBACK: Feature[] = [
  { title: "Daily Speaking Practice", description: "Build real confidence." },
  { title: "Small Batch Size", description: "Personal attention." },
];

const ICONS: Record<string, typeof Sparkles> = {
  BadgeCheck,
  BookOpen,
  Briefcase,
  GraduationCap,
  Laptop,
  MessageSquare,
  Sparkles,
};

export default function WhyChooseUs() {
  const reduceMotion = useSafeReducedMotion();
  const [features, setFeatures] = useState<Feature[]>(FALLBACK);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("features")
        .select("title, description, icon")
        .eq("section_slug", "why-choose-us")
        .eq("is_active", true)
        .order("sort_order");

      if (data && data.length > 0) setFeatures(data);
    })();
  }, []);

  return (
    <section className="bg-[#F8FBFF] py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
            Why Choose Us
          </span>

          <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl lg:text-4xl">
            Why Choose Elite English Academy
          </h2>

          <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Learn English with expert trainers, practical speaking sessions, and career-focused guidance.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon, title, description }, index) => {
            const Icon = ICONS[icon || "BadgeCheck"] || BadgeCheck;

            return (
              <motion.div
                key={title}
                initial={
                  reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 18 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : index * 0.05,
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold leading-tight text-blue-950">
                  {title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-[13px] leading-5 text-slate-600">
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