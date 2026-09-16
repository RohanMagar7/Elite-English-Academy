"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { Mail, MapPin, Phone, GraduationCap } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AboutPage() {
    const { settings } = useSiteSettings();
    return (
        <>
            <Navbar />
            <AboutSection />

            <section className="bg-white py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div>
                            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                                Meet the Mentor
                            </span>
                            <h2 className="mt-5 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                                Prof. J. M. Wagh-Dhotre
                            </h2>
                            <p className="mt-4 text-base font-semibold text-[#2563EB] sm:text-lg">
                                M.A. English | MH-SET
                            </p>
                            <p className="mt-2 text-lg font-medium text-slate-700">
                                12+ Years of Teaching Experience
                            </p>
                            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                                Under the guidance of Prof. J. M. Wagh-Dhotre, students build speaking confidence, improve communication, and gain the skills needed for academic and professional success through structured mentoring and practical learning.
                            </p>

                            <div className="mt-8 space-y-4 text-slate-700">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-[#2563EB]" />
                                    <a href={settings.phone_href} className="font-medium hover:text-blue-700">{settings.phone_display}</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-[#2563EB]" />
                                    <a href={`mailto:${settings.email}`} className="font-medium hover:text-blue-700">{settings.email}</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-[#2563EB]" />
                                    <span>{settings.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-blue-100 bg-[#F8FBFF] p-6 shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                                <GraduationCap className="h-10 w-10" />
                            </div>
                            <h3 className="mt-6 text-2xl font-black text-blue-950">Trainer • Mentor • Guide</h3>
                            <p className="mt-4 text-base leading-8 text-slate-600">
                                With a strong academic foundation in English and a passion for mentoring, Prof. J. M. Wagh-Dhotre helps learners improve fluency, confidence, and real-world communication through focused guidance and practical teaching methods.
                            </p>
                            <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-700">
                                <p className="text-cyan-950"><span className="font-bold text-blue-950">Expertise:</span> Spoken English, IELTS, Grammar, Personal Mentorship, Teacher Training</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

