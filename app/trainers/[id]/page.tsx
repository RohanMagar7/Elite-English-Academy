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
    Award,
    BadgeCheck,
    GraduationCap,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

interface Trainer {
    id: string;
    name: string;
    qualification: string;
    experience: string;
    specialization: string;
    role?: string | null;
    photo_url?: string | null;
    is_active?: boolean;
}

export default function TrainerDetailsPage() {
    const params = useParams<{ id: string }>();
    const trainerId = params?.id;
    const { settings } = useSiteSettings();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trainerId) return;

        async function load() {
            try {
                const { data, error: fetchError } = await supabase
                    .from("trainers")
                    .select("*")
                    .eq("id", trainerId)
                    .eq("is_active", true)
                    .single();

                if (fetchError) {
                    setError("We couldn't find this trainer. They may have been removed or are no longer active.");
                    setTrainer(null);
                } else {
                    setTrainer(data);
                }
            } catch {
                setError("Something went wrong while loading this trainer. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [trainerId]);

    const fallbackPhoto = (name: string) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name || "Trainer"
        )}&background=2563EB&color=fff`;

    return (
        <>
            <Navbar />

            <section className="bg-[#F8FBFF] py-6 sm:py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/#trainers"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Trainers
                    </Link>

                    {loading && (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
                            <p className="text-sm font-medium text-slate-600">Loading trainer details…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-12 text-center shadow-sm">
                            <p className="text-base font-semibold text-red-700">{error}</p>
                            <Link
                                href="/#trainers"
                                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                View All Trainers
                            </Link>
                        </div>
                    )}

                    {!loading && trainer && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
                            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                                {/* Trainer Photo */}
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-blue-50 p-4 md:aspect-auto md:min-h-full">
                                    <Image
                                        src={trainer.photo_url || fallbackPhoto(trainer.name)}
                                        alt={trainer.name}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        className="object-contain"
                                    />
                                </div>

                                {/* Trainer Content */}
                                <div className="p-5 sm:p-8">
                                    {/* Role Badge */}
                                    {trainer.role && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-blue-950">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            {trainer.role}
                                        </span>
                                    )}

                                    <h1 className="mt-3 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
                                        {trainer.name}
                                    </h1>

                                    {trainer.qualification && (
                                        <p className="mt-1.5 text-base font-semibold text-blue-700">
                                            {trainer.qualification}
                                        </p>
                                    )}

                                    {trainer.experience && (
                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                            {trainer.experience}
                                        </p>
                                    )}

                                    {/* Specialization */}
                                    {trainer.specialization && (
                                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                            <p className="flex items-center gap-2 text-sm font-bold text-blue-950">
                                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                                Specialization
                                            </p>
                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                                {trainer.specialization}
                                            </p>
                                        </div>
                                    )}

                                    {/* Qualification & Experience Details */}
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4">
                                            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Qualification
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-blue-950">
                                                    {trainer.qualification || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4">
                                            <Award className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Experience
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-blue-950">
                                                    {trainer.experience || "—"}
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
                                            Enroll with Us
                                        </Link>

                                        <a
                                            href={whatsappLink(
                                                settings.whatsapp_number,
                                                `Hello ${settings.academy_name}, I want to know more about training with ${trainer.name}.`
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-600 px-5 text-sm font-bold text-green-600 transition hover:bg-green-50"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Ask on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Contact Help */}
                    {!loading && trainer && (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold text-blue-950">Want to meet our trainers in person?</p>
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
