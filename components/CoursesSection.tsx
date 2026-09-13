"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { academy } from "@/lib/site";

interface Course {
  id: string;
  title: string;
  duration: string;
  fees: number;
  description: string | null;
  image_url?: string | null;
  mode?: string | null;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCourses(data);
      }
    }

    loadCourses();
  }, []);

  return (
    <section className="bg-[#F8FBFF] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
            Our Courses
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
            Learn with Confidence
          </h2>
        </div>

        {/* Courses */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : index * 0.05,
                ease: "easeOut",
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {/* Course Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {course.image_url ? (
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-100 text-sm font-semibold uppercase tracking-widest text-blue-900">
                    Course
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Title + Mode */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-h-[44px] flex-1 text-base font-bold leading-tight text-blue-950 line-clamp-2 sm:text-lg">
                    {course.title}
                  </h3>

                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-[#2563EB]">
                    {course.mode || "Online / Offline"}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm leading-5 text-slate-600 line-clamp-4">
                  {course.description ||
                    "Build your communication skills with guided practice and expert support."}
                </p>

                {/* Duration + Fees */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {course.duration}
                  </span>

                  <span className="text-lg font-black text-[#2563EB]">
                    ₹ {course.fees.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/admission"
                    className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Enroll Now
                  </Link>

                  <a
                    href={`${academy.whatsappHref}?text=${encodeURIComponent(
                      `Hello Elite English Academy, I want to enquire about "${course.title}".`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                  >
                    <MessageCircle className="h-4 w-4" />
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