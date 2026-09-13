"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Testimonial = {
    id: string;
    name: string;
    course: string;
    message: string;
    avatar?: string | null;
    rating?: number | null;
    is_active?: boolean;
};

const defaultForm = {
    name: "",
    course: "",
    message: "",
    rating: 5,
};

const getAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Student")}&background=2563EB&color=fff`;

export default function TestimonialSection() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState("");
    const [showForm, setShowForm] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    async function loadTestimonials() {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(6);

        if (!error) {
            setItems(data || []);
        }
    }

    useEffect(() => {
        loadTestimonials();
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const target = e.target as HTMLInputElement;
        const value = target.type === "number" ? Number(target.value) : target.value;
        setForm((prev) => ({ ...prev, [target.name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setNotice("");

        const payload = {
            name: form.name.trim(),
            course: form.course.trim() || "General English",
            message: form.message.trim(),
            rating: Number(form.rating) || 5,
            is_active: true,
        };

        if (!payload.name || !payload.message) {
            setNotice("Please enter your name and review.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("testimonials").insert([payload]);

        setLoading(false);

        if (error) {
            setNotice(error.message || "Unable to submit your review right now.");
            return;
        }

        setForm(defaultForm);
        setNotice("Thank you! Your review has been submitted successfully.");
        loadTestimonials();
    }

    return (
        <section className="bg-white py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="mb-10 text-center">
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                        Student Reviews
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                        What our students say
                    </h2>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setShowForm((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
                    >
                        {showForm ? "Close Review Form" : "Review"}
                    </button>
                </div>

                {showForm && (
                    <div className="mt-8 rounded-[1.75rem] border border-blue-100 bg-blue-50/40 p-5 shadow-[0_12px_30px_rgba(37,99,235,0.05)] sm:p-8">
                        <div className="mb-6 text-center">
                            <h3 className="text-2xl font-black text-blue-950">Leave a review</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Share your experience with our courses and learning journey.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none ring-0 transition black focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Course</label>
                                <input
                                    name="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    placeholder="Course name"
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
                                <select
                                    name="rating"
                                    value={form.rating}
                                    onChange={handleChange as any}
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
                                >
                                    <option value={5}>5 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={1}>1 Star</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Your review</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Tell us about your experience..."
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-col items-center justify-center gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Submitting..." : "Submit Review"}
                                </button>

                                {notice && (
                                    <p className="text-sm font-medium text-blue-900">{notice}</p>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-10 flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
                    {items.length === 0 ? (
                        <div className="md:col-span-3 w-full rounded-[1.5rem] border border-dashed border-blue-200 bg-blue-50/60 p-8 text-center text-slate-600">
                            No reviews yet. Be the first to share your experience.
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={shouldReduceMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.12 }}
                                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                                className="min-w-[280px] flex-1 snap-center rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-[0_16px_40px_rgba(37,99,235,0.08)] md:min-w-0"
                            >
                                <div className="mb-5 flex items-center gap-4">
                                    <img
                                        src={item.avatar || getAvatarUrl(item.name)}
                                        alt={item.name}
                                        className="h-14 w-14 rounded-full object-cover ring-3 ring-blue-100"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-950">{item.name}</h3>
                                        <p className="text-sm font-medium text-[#2563EB]">{item.course}</p>
                                    </div>
                                </div>

                                <div className="mb-4 flex items-center gap-1 text-lg text-amber-400" aria-label={`${item.rating || 5} star rating`}>
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <span key={starIndex} className={starIndex < (item.rating || 5) ? "text-amber-400" : "text-slate-200"}>
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <p className="text-base leading-7 text-slate-600">“{item.message}”</p>
                            </motion.article>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
}

