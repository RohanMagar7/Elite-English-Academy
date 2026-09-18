/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";
import { admissionSchema } from "@/lib/validation";
import { apiFetch } from "@/lib/api-client";

export default function AdmissionPage() {
    const { settings } = useSiteSettings();
    const [form, setForm] = useState({
        student_name: "",
        parent_name: "",
        phone: "",
        email: "",
        class_name: "",
        course: "",
        preferred_batch: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();

        const parsed = admissionSchema.safeParse(form);
        if (!parsed.success) {
            alert(parsed.error.issues[0]?.message ?? "Please check the form fields.");
            return;
        }

        setLoading(true);

        let ok = false;
        let errText = "Unable to submit right now. Please try again.";
        try {
            await apiFetch<void>("/api/admissions", { method: "POST", body: parsed.data });
            ok = true;
        } catch (err) {
            errText = err instanceof Error && err.message ? err.message : errText;
        }

        setLoading(false);

        if (!ok) {
            alert(errText);
            return;
        }

        alert("Admission enquiry submitted successfully!");

        setForm({
            student_name: "",
            parent_name: "",
            phone: "",
            email: "",
            class_name: "",
            course: "",
            preferred_batch: "",
            message: "",
        });
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-[#F8FBFF] py-6 sm:py-8">
                <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-8 text-white shadow-[0_25px_60px_rgba(37,99,235,0.35)]">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                            Admissions Open
                        </span>
                        <h2 className="mt-4 font-section font-black  sm:text-4xl lg:text-5xl">Limited Seats Available</h2>
                        <p className="mt-4 max-w-2xl font-body text-blue-100 sm:text-lg">
                            Join Elite English Academy for practical speaking training, personalized mentoring, and confidence-building classes guided by Prof. J. M. Wagh-Dhotre.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a href={settings.phone_href} className="btn-ghost">{settings.phone_display}</a>
                            <a href={`mailto:${settings.email}`} className="btn-secondary">{settings.email}</a>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
                            <h2 className="text-3xl font-black text-blue-950">Admission Enquiry</h2>
                            <p className="mt-2 text-base text-slate-600">Fill out the form below and our team will contact you soon.</p>

                            <form onSubmit={submitForm} className="mt-8 space-y-5">
                                <input
                                    name="student_name"
                                    placeholder="Student Name"
                                    value={form.student_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    required
                                />

                                <input
                                    name="parent_name"
                                    placeholder="Parent Name"
                                    value={form.parent_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />

                                <input
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    required
                                />

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />

                                <select
                                    name="class_name"
                                    value={form.class_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Class</option>
                                    <option>1st</option>
                                    <option>2nd</option>
                                    <option>3rd</option>
                                    <option>4th</option>
                                    <option>5th</option>
                                    <option>6th</option>
                                    <option>7th Scholarship</option>
                                    <option>8th</option>
                                    <option>9th</option>
                                    <option>10th</option>
                                    <option>Confident English Teacher Program</option>

                                </select>

                                <select
                                    name="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="">Select Course</option>
                                    <option>English Speaking</option>
                                    <option>IELTS Preparation</option>
                                    <option>Grammar & Vocabulary</option>
                                    <option>Teacher Training</option>
                                    <option>Personal Mentorship</option>
                                </select>

                                <select
                                    name="preferred_batch"
                                    value={form.preferred_batch}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="">Preferred Batch</option>
                                    <option>Morning</option>
                                    <option>Afternoon</option>
                                    <option>Evening</option>
                                    <option>Weekend</option>
                                </select>

                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="Message (Optional)"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />

                                <button
                                    disabled={loading}
                                    className="btn-primary w-full"
                                >
                                    {loading ? "Submitting..." : "Submit Enquiry"}
                                </button>

                                <a
                                    href={whatsappLink(settings.whatsapp_number, `Hello ${settings.academy_name}, I'd like to know more about the "${form.course || "course"}" (${form.preferred_batch || "batch"}).`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary w-full flex items-center justify-center"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Enquire on WhatsApp
                                </a>
                            </form>
                        </div>

                        <aside className="self-start h-fit rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
                            <h3 className="text-2xl font-black text-blue-950">
                                Contact Details
                            </h3>

                            <div className="mt-6 space-y-5 text-slate-600">
                                {/* Phone */}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        Phone
                                    </p>
                                    <a
                                        href={settings.phone_href}
                                        className="mt-2 block text-lg font-semibold text-blue-950 hover:text-blue-700 transition-colors"
                                    >
                                        {settings.phone_display}
                                    </a>
                                </div>

                                {/* Email */}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="mt-2 block text-lg font-semibold text-blue-950 hover:text-blue-700 transition-colors"
                                    >
                                        {settings.email}
                                    </a>
                                </div>

                                {/* Address */}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        Address
                                    </p>
                                    <p className="mt-2 text-base leading-7 text-slate-600">
                                        {settings.address}
                                    </p>
                                </div>

                                {/* WhatsApp Button */}
                                <a
                                    href={whatsappLink(settings.whatsapp_number, "Hello! I want admission information.")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 font-semibold text-white transition hover:bg-[#15803D]"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}