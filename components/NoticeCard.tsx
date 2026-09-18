/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/lib/supabase";
import SectionHeading from "@/components/home/SectionHeading";
import { Badge, EmptyState, LoaderBlock } from "@/components/ui";

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at?: string;
}

const EN_IN_DATE = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

async function fetchNotices() {
  return supabase
    .from("notices")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);
}

export default function NoticeSection() {
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);
  const reduceMotion = useSafeReducedMotion();
  const { data: notices, loading } = useSupabaseQuery<Notice>(fetchNotices);

  if (loading) {
    return (
      <section id="notices" aria-busy="true" className="bg-[#F8FBFF] py-5 sm:py-7 lg:py-8">
        <LoaderBlock label="Loading notices" />
      </section>
    );
  }

  return (
    <section id="notices" className="bg-[#F8FBFF] py-5 sm:py-7 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Latest Updates"
          title="Latest Notices"
          description="Admissions, new batches, events, and important academy announcements."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {notices.map((notice, index) => {
            const isExpanded = expandedNotice === notice.id;

            return (
              <motion.div
                key={notice.id}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: reduceMotion ? 0 : index * 0.05,
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group flex h-full flex-col rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
              >
                <Badge variant="gold" className="w-fit">
                  {notice.category}
                </Badge>

                <h3 className="mt-3 text-lg font-bold leading-snug text-blue-950 line-clamp-2">
                  {notice.title}
                </h3>

                <p
                  className={`mt-2 flex-1 text-sm leading-6 text-slate-600 transition-all duration-300 ${
                    isExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {notice.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                    {notice.created_at ? EN_IN_DATE.format(new Date(notice.created_at)) : "Latest Update"}
                  </div>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedNotice(isExpanded ? null : notice.id)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                    <ArrowRight
                      aria-hidden
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {notices.length === 0 && (
          <EmptyState
            title="No notices right now"
            description="Announcements about admissions, batches and events will appear here."
          />
        )}
      </div>
    </section>
  );
}
