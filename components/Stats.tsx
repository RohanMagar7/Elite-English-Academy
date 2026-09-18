/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Laptop,
  Sparkles,
  BadgeCheck,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Stat = {
  label: string;
  value: number;
  suffix?: string | null;
  icon?: string | null;
};

const FALLBACK: Stat[] = [
  { label: "Happy Students", value: 500, suffix: "+", icon: "GraduationCap" },
  { label: "Years Experience", value: 12, suffix: "+", icon: "BadgeCheck" },
  { label: "Courses Offered", value: 15, suffix: "+", icon: "BookOpen" },
  { label: "Placement Success", value: 95, suffix: "%", icon: "Trophy" },
];

const ICONS: Record<string, typeof Sparkles> = {
  GraduationCap,
  BookOpen,
  Laptop,
  Sparkles,
  BadgeCheck,
  Trophy,
};

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-2xl sm:text-3xl font-black text-blue-950"
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
      const { data } = await supabase
        .from("stats")
        .select("label, value, suffix, icon")
        .eq("is_active", true)
        .order("sort_order");

      if (data && data.length > 0) setStats(data);
    })();
  }, []);

  return (
    <section className="bg-[#F8FBFF] py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ icon, value, suffix, label }) => {
            const Icon = ICONS[icon || "Sparkles"] || Sparkles;

            return (
              <motion.div
                key={label}
                initial={
                  reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 15 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  ease: "easeOut",
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {/* Number */}
                <div className="mt-3">
                  <AnimatedNumber
                    value={Number(value)}
                    suffix={suffix || ""}
                  />
                </div>

                {/* Label */}
                <p className="mt-2 text-sm font-semibold leading-5 text-slate-600">
                  {label}
                </p>

                {/* Arrow */}
                <div className="mt-3 flex justify-center">
                  <ArrowUpRight className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}