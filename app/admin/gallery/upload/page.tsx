"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadGallery() {
    const [form, setForm] = useState({ title: "", image_url: "" });
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("gallery").insert([{ title: form.title, image_url: form.image_url }]);
        setLoading(false);
        if (error) return alert(error.message);
        alert("Image added to gallery.");
        setForm({ title: "", image_url: "" });
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Upload Gallery Image</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="title" placeholder="Image Title" value={form.title} onChange={change} className="w-full border p-3 rounded" />
                <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={change} className="w-full border p-3 rounded" required />
                <button disabled={loading} className="bg-blue-900 text-white px-4 py-2 rounded">{loading ? "Uploading..." : "Upload"}</button>
            </form>
        </div>
    );
}

