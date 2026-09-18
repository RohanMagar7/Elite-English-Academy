"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

interface Course {
  id: string;
  title: string;
  duration: string;
  fees: number;
  description: string | null;
  image_url?: string | null;
  mode?: string | null;
  eligibility?: string | null;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const reduceMotion = useSafeReducedMotion();
  const { settings } = useSiteSettings();

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) setCourses(data);
    }

    loadCourses();
  }, []);

  return (
    <section className="bg-[#F8FBFF] py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
            Our Courses
          </span>

          <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl lg:text-4xl">
            Learn with Confidence
          </h2>

          <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-slate-600">
            Practical English courses to improve confidence, communication, and career opportunities.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={
                reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
              whileHover={!reduceMotion ? { y: -4 } : undefined}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
            >
              {/* Image */}
              <Link
                href={`/courses/${course.id}`}
                className="relative block aspect-[16/9] overflow-hidden"
                aria-label={`View details of ${course.title}`}
              >
                <Image
                  src={
                    !failedImages[course.id] && course.image_url
                      ? course.image_url
                      : "/images/course-placeholder.webp"
                  }
                  alt={course.title}
                  fill
                  unoptimized
                  sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [course.id]: true,
                    }))
                  }
                />
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-2.5">
                {/* Title */}
                <Link href={`/courses/${course.id}`} className="w-fit">
                  <h3 className="line-clamp-2 text-base font-bold leading-tight text-blue-950 transition hover:text-blue-700">
                    {course.title}
                  </h3>
                </Link>

                {/* Mode Badge */}
                <span className="mt-1 inline-flex w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  {course.mode || "Online & Offline"}
                </span>

                {/* Description */}
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-600">
                  {course.description ||
                    "Build your communication skills with guided practice and expert support."}
                </p>

                {/* Duration + Fees */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    {course.duration}
                  </span>

                  <span className="text-base font-black text-blue-600">
                    ₹ {course.fees.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Eligibility */}
                {course.eligibility && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span>Eligibility: {course.eligibility}</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/admission"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-2 text-[13px] font-semibold text-white transition hover:bg-blue-700"
                  >
                    Enroll Now
                  </Link>

                  <a
                    href={whatsappLink(
                      settings.whatsapp_number,
                      `Hello ${settings.academy_name}, I want to enquire about "${course.title}".`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-green-600 px-2 text-[13px] font-semibold text-green-600 transition hover:bg-green-50"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}