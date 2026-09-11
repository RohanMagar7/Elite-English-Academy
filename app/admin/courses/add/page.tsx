"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCourse() {
    const [form, setForm] = useState({ title: "", duration: "", fees: "", description: "" });
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const payload = { title: form.title, duration: form.duration, fees: Number(form.fees), description: form.description };
        const { error } = await supabase.from("courses").insert([payload]);
        setLoading(false);
        if (error) return alert(error.message);
        alert("Course added.");
        setForm({ title: "", duration: "", fees: "", description: "" });
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Add Course</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="title" placeholder="Course Title" value={form.title} onChange={change} className="w-full border p-3 rounded" required />
                <input name="duration" placeholder="Duration (e.g., 3 months)" value={form.duration} onChange={change} className="w-full border p-3 rounded" />
                <input name="fees" placeholder="Fees" value={form.fees} onChange={change} className="w-full border p-3 rounded" />
                <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="w-full border p-3 rounded" />

                <button disabled={loading} className="bg-blue-900 text-white px-4 py-2 rounded">{loading ? "Saving..." : "Add Course"}</button>
            </form>
        </div>
    );
}

