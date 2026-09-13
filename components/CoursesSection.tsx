"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
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
    async function load() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setCourses(data || []);
    }
    load();
  }, []);

  return (
    <section className="bg-[#F8FBFF] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
            Our Courses
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
            Learn with Confidence
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : index * 0.05, ease: "easeOut" }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.06)]"
            >
              <div className="relative overflow-hidden">
                {course.image_url ? (
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    width={800}
                    height={500}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-blue-100 text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
                    Course
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-blue-950">{course.title}</h3>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                    {course.mode || "Online"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {course.description || "Build your communication skills with guided practice and expert support."}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {course.duration}
                  </span>
                  <span className="text-lg font-black text-[#2563EB]">₹ {course.fees}</span>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/admission"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Enroll Now
                  </Link>
                  <a
                    href={`${academy.whatsappHref}?text=${encodeURIComponent(`Hello Elite English Academy, I want to enquire about ${course.title}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <a href={academy.phoneHref} className="flex items-center gap-2 hover:text-blue-700">
                    <Phone className="h-4 w-4 text-[#2563EB]" />
                    {academy.phoneDisplay}
                  </a>
                  <a href={academy.emailHref} className="flex items-center gap-2 hover:text-blue-700">
                    <Mail className="h-4 w-4 text-[#2563EB]" />
                    {academy.email}
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