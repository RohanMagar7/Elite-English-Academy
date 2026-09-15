"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import { academy } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export default function AdmissionPage() {
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

        setLoading(true);

        const { error } = await supabase.from("admissions").insert([form]);

        setLoading(false);

        if (error) {
            alert(error.message);
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

            <div className="min-h-screen bg-[#F8FBFF] py-8 sm:py-10">
                <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-8 text-white shadow-[0_25px_60px_rgba(37,99,235,0.35)]">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                            Admissions Open
                        </span>
                        <h1 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">Limited Seats Available</h1>
                        <p className="mt-4 max-w-2xl text-base text-blue-100">
                            Join Elite English Academy for practical speaking training, personalized mentoring, and confidence-building classes guided by Prof. J. M. Wagh-Dhotre.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a href={academy.phoneHref} className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1D4ED8]">Call: {academy.phoneDisplay}</a>
                            <a href={academy.emailHref} className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white">Email: {academy.email}</a>
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
                                    className="w-full bg-blue-900 text-white p-4 rounded-lg font-semibold hover:bg-blue-800"
                                >
                                    {loading ? "Submitting..." : "Submit Enquiry"}
                                </button>

                                <a
                                    href={`${academy.whatsappHref}?text=${encodeURIComponent(
                                        `Hello Elite English Academy, I'd like to know more about the "${form.course || "course"}" (${form.preferred_batch || "batch"}).`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-500 bg-green-50 p-4 font-semibold text-green-700 transition hover:bg-green-100"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Enquire on WhatsApp
                                </a>
                            </form>
                        </div>

                        <aside className="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
                            <h3 className="text-2xl font-black text-blue-950">Contact Details</h3>
                            <div className="mt-6 space-y-5 text-slate-700">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</p>
                                    <a href={academy.phoneHref} className="mt-2 block text-lg font-semibold text-blue-900 hover:text-blue-700">{academy.phoneDisplay}</a>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Email</p>
                                    <a href={academy.emailHref} className="mt-2 block text-lg font-semibold text-blue-900 hover:text-blue-700">{academy.email}</a>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Address</p>
                                    <p className="mt-2 text-base leading-7 text-slate-700">{academy.address}</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}