"use client";

import { Camera, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { academy } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("contacts").insert([
            {
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                subject: form.subject.trim() || "General Enquiry",
                message: form.message.trim(),
            },
        ]);
        setLoading(false);
        if (error) {
            setToast(error.message || "Unable to send your message right now.");
            return;
        }
        setToast("Thanks! Your message has been sent successfully.");
        setForm({ full_name: "", email: "", phone: "", subject: "", message: "" });
    }

    return (
        <>
            <Navbar />

            <main className="bg-slate-50 py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="grid gap-8 lg:grid-cols-[1.08fr_1.32fr]">
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
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</p>
                                        <a href={academy.phoneHref} className="mt-2 block text-base font-medium text-slate-700 hover:text-blue-700">
                                            {academy.phoneDisplay}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">WhatsApp</p>
                                        <a
                                            href={`${academy.whatsappHref}?text=${encodeURIComponent(academy.whatsappMessage)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 block text-base font-medium text-slate-700 hover:text-blue-700"
                                        >
                                            {academy.phoneDisplay}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Email</p>
                                        <a href={academy.emailHref} className="mt-2 block text-base font-medium text-slate-700 hover:text-blue-700">
                                            {academy.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Address</p>
                                        <p className="mt-2 text-base font-medium text-slate-700">{academy.address}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Business Hours</p>
                                        <p className="mt-2 text-base font-medium text-slate-700">
                                            Mon – Sat: 7:00 AM – 9:00 PM
                                        </p>
                                        <p className="text-base font-medium text-slate-700">
                                            Sunday: Weekend batches (by schedule)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <a
                                            aria-label="WhatsApp"
                                            href={`${academy.whatsappHref}?text=${encodeURIComponent(academy.whatsappMessage)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white transition hover:opacity-90"
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                        </a>
                                        <a
                                            aria-label="Instagram"
                                            href={academy.instagramHref}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 text-white transition hover:opacity-90"
                                        >
                                            <Camera className="h-5 w-5" />
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Follow Us</p>
                                        <p className="mt-2 text-base font-medium text-slate-700">
                                            Stay updated with our latest batches & events
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_18px_40px_rgba(37,99,235,0.08)] sm:p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-blue-950">Send us a message</h2>
                                <p className="mt-2 text-sm text-slate-600">We’ll contact you as soon as possible.</p>
                            </div>

                            <form onSubmit={submit} className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={change}
                                        required
                                        placeholder="Full Name"
                                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={change}
                                        required
                                        placeholder="Phone Number"
                                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={change}
                                        required
                                        placeholder="Email Address"
                                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                    <input
                                        name="subject"
                                        value={form.subject}
                                        onChange={change}
                                        placeholder="Subject"
                                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={change}
                                    required
                                    rows={6}
                                    placeholder="Your message"
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>

                                {toast && (
                                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
                                        {toast}
                                    </div>
                                )}
                            </form>

                            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-blue-100">
                                <iframe
                                    title="Elite English Academy Map"
                                    src={`https://www.google.com/maps?q=${academy.mapsQuery}&z=15&output=embed`}
                                    className="h-[320px] w-full border-0"
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

