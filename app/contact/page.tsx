"use client";

import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "", phone: "" });
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("contacts").insert([form]);
        setLoading(false);
        if (error) return alert(error.message);
        alert("Thanks — we will get back to you.");
        setForm({ name: "", email: "", message: "", phone: "" });
    }

    return (
        <>
            <Navbar />

            <main className="bg-slate-50 py-14 sm:py-16">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="grid gap-8 lg:grid-cols-[1.05fr_1.35fr]">
                        <section className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_18px_40px_rgba(37,99,235,0.08)] sm:p-8">
                            <div className="mb-6">
                                <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
                                    Contact
                                </span>
                                <h1 className="mt-4 text-3xl font-black text-blue-950 sm:text-4xl">Let’s talk</h1>
                                <p className="mt-3 text-base text-slate-600">
                                    Reach out for admissions, course guidance, and personalized learning support.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Address</p>
                                        <p className="mt-2 text-base font-medium text-slate-700">
                                            Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</p>
                                        <a href="tel:+8801700000000" className="mt-2 block text-base font-medium text-slate-700 hover:text-blue-700">
                                            +88 01700-000000
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Email</p>
                                        <a href="mailto:info@eliteenglishacademy.com" className="mt-2 block text-base font-medium text-slate-700 hover:text-blue-700">
                                            info@eliteenglishacademy.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <Clock3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Opening Hours</p>
                                        <p className="mt-2 text-base font-medium text-slate-700">Mon - Sat: 9:00 AM - 8:00 PM</p>
                                    </div>
                                </div>

                                <a
                                    href="https://wa.me/8801700000000"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-base font-semibold text-white shadow-[0_14px_26px_rgba(37,211,102,0.25)] transition hover:bg-[#1ebe5d]"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp Now
                                </a>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-3 shadow-[0_18px_40px_rgba(37,99,235,0.08)] sm:p-4">
                            <div className="overflow-hidden rounded-[1.5rem]">
                                <iframe
                                    title="Elite English Academy Map"
                                    src="https://www.google.com/maps?q=Near+Sai+Deep+Hospital,+Mondha+Naka,+Georai,+Beed,+Maharashtra&z=15&output=embed"
                                    className="h-[530px] w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

