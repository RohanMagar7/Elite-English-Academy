"use client";

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

            <div className="min-h-screen bg-blue-50 flex justify-center p-8">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Contact Us</h1>
                    <p className="text-gray-600 mb-6">Reach out for admissions, partnerships, and queries.</p>

                    <form onSubmit={submit} className="space-y-4">
                        <input name="name" placeholder="Your Name" value={form.name} onChange={change} className="w-full border p-3 rounded" required />
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className="w-full border p-3 rounded" />
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={change} className="w-full border p-3 rounded" />
                        <textarea name="message" rows={4} placeholder="Message" value={form.message} onChange={change} className="w-full border p-3 rounded" />

                        <button className="w-full bg-blue-900 text-white p-3 rounded" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}

