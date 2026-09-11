"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddNotice() {
    const [form, setForm] = useState({ title: "", description: "", category: "General", is_active: true });
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("notices").insert([{ title: form.title, description: form.description, category: form.category, is_active: form.is_active }]);
        setLoading(false);
        if (error) return alert(error.message);
        alert("Notice published.");
        setForm({ title: "", description: "", category: "General", is_active: true });
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Add Notice</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="title" placeholder="Title" value={form.title} onChange={change} className="w-full border p-3 rounded" required />
                <select name="category" value={form.category} onChange={change} className="w-full border p-3 rounded">
                    <option>General</option>
                    <option>Admission</option>
                    <option>Exam</option>
                </select>
                <textarea name="description" rows={4} placeholder="Description" value={form.description} onChange={change} className="w-full border p-3 rounded" />
                <label className="flex items-center gap-3">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>

                <button disabled={loading} className="bg-blue-900 text-white px-4 py-2 rounded">{loading ? "Saving..." : "Publish Notice"}</button>
            </form>
        </div>
    );
}

