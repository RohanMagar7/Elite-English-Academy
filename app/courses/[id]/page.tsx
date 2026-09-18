/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarClock,
    GraduationCap,
    IndianRupee,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Sparkles,
    Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    is_active?: boolean;
}

export default function CourseDetailsPage() {
    const params = useParams<{ id: string }>();
    const courseId = params?.id;
    const { settings } = useSiteSettings();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;

        async function load() {
            try {
                const { data, error: fetchError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", courseId)
                    .eq("is_active", true)
                    .single();

                if (fetchError) {
                    setError("We couldn't find this course. It may have been removed or is no longer active.");
                    setCourse(null);
                } else {
                    setCourse(data);
                }
            } catch {
                setError("Something went wrong while loading this course. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [courseId]);

    return (
        <>
            <Navbar />

            <section className="bg-[#F8FBFF] py-6 sm:py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Courses
                    </Link>

                    {loading && (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
                            <p className="text-sm font-medium text-slate-600">Loading course details…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-12 text-center shadow-sm">
                            <p className="text-base font-semibold text-red-700">{error}</p>
                            <Link
                                href="/courses"
                                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                View All Courses
                            </Link>
                        </div>
                    )}

                    {!loading && course && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
                            {/* Course Image */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-blue-50">
                                <Image
                                    src={course.image_url || "/images/course-placeholder.webp"}
                                    alt={course.title}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    className="object-contain p-2"
                                />
                            </div>

                            {/* Course Content */}
                            <div className="p-5 sm:p-8">
                                {/* Title + Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        <Users className="mr-1.5 h-3.5 w-3.5" />
                                        {course.mode || "Online & Offline"}
                                    </span>

                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                                        {course.duration}
                                    </span>
                                </div>

                                <h1 className="mt-3 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
                                    {course.title}
                                </h1>

                                {/* Fees */}
                                <div className="mt-4 inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-[#F8FBFF] px-4 py-2.5">
                                    <IndianRupee className="h-5 w-5 text-blue-600" />
                                    <span className="text-2xl font-black text-blue-600">
                                        {course.fees.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">/ full course</span>
                                </div>

                                {/* Description */}
                                <div className="mt-6">
                                    <h2 className="text-lg font-bold text-blue-950">Course Description</h2>
                                    <p className="mt-2 whitespace-pre-line text-base leading-8 text-slate-600">
                                        {course.description ||
                                            "Build your communication skills with guided practice, expert support, and practical learning methods."}
                                    </p>
                                </div>

                                {/* Eligibility */}
                                {course.eligibility && (
                                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                        <p className="flex items-center gap-2 text-sm font-bold text-blue-950">
                                            <Sparkles className="h-4 w-4 text-yellow-500" />
                                            Eligibility
                                        </p>
                                        <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                            {course.eligibility}
                                        </p>
                                    </div>
                                )}

                                {/* Quick Details */}
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4">
                                        <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Duration
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-blue-950">
                                                {course.duration}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4">
                                        <Users className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Mode
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-blue-950">
                                                {course.mode || "Online & Offline"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    <Link
                                        href="/admission"
                                        className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                                    >
                                        Enroll Now
                                    </Link>

                                    <a
                                        href={whatsappLink(
                                            settings.whatsapp_number,
                                            `Hello ${settings.academy_name}, I want to enquire about the "${course.title}" course.`
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-600 px-5 text-sm font-bold text-green-600 transition hover:bg-green-50"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Enquire on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Help */}
                    {!loading && course && (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold text-blue-950">Need help choosing a course?</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                <a
                                    href={settings.phone_href}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
                                >
                                    <Phone className="h-4 w-4 shrink-0 text-blue-700" />
                                    {settings.phone_display}
                                </a>
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
                                >
                                    <Mail className="h-4 w-4 shrink-0 text-blue-700" />
                                    {settings.email}
                                </a>
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <MapPin className="h-4 w-4 shrink-0 text-blue-700" />
                                    {settings.address}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

