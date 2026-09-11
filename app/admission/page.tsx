
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function AdmissionPage() {
    const [form, setForm] = useState({
        student_name: "",
        parent_name: "",
        phone: "",
        email: "",
        class_name: "",
        course: "",
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
            message: "",
        });
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-blue-50 flex justify-center p-8">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

                    <h1 className="text-4xl font-bold text-blue-900 mb-2">
                        Admission Enquiry
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Elite English Academy • Admissions Open 2026
                    </p>

                    <form onSubmit={submitForm} className="space-y-5">

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
                        </select>

                        <select
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        >
                            <option value="">Select Course</option>
                            <option>English Speaking</option>
                            <option>Personal Mentorship</option>
                            <option>Scholarship Preparation</option>
                            <option>English Teacher Training</option>
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

                    </form>

                </div>
            </div>

            <Footer />
        </>
    );
}