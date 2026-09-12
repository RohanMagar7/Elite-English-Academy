"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCourse() {
    const [form, setForm] = useState({ title: "", duration: "", fees: "", description: "", image_url: "" });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function uploadCourseImage(selectedFile: File): Promise<string> {
        const buckets = ["courses", "gallery"];
        let lastError: Error | null = null;

        for (const bucket of buckets) {
            const fileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, "-")}`;
            const { error } = await supabase.storage.from(bucket).upload(fileName, selectedFile);

            if (!error) {
                const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
                return data.publicUrl;
            }

            lastError = error;
        }

        throw new Error(lastError?.message || "Unable to upload course image to storage.");
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = form.image_url.trim() || null;

            if (file) {
                imageUrl = await uploadCourseImage(file);
            }

            const payload = {
                title: form.title,
                duration: form.duration,
                fees: Number(form.fees),
                description: form.description,
                image_url: imageUrl,
            };
            const { error } = await supabase.from("courses").insert([payload]);
            if (error) return alert(error.message);
            alert("Course added.");
            setForm({ title: "", duration: "", fees: "", description: "", image_url: "" });
            setFile(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to upload course image.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Add Course</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="title" placeholder="Course Title" value={form.title} onChange={change} className="input-default" required />
                <input name="duration" placeholder="Duration (e.g., 3 months)" value={form.duration} onChange={change} className="input-default" />
                <input name="fees" placeholder="Fees" value={form.fees} onChange={change} className="input-default" />
                <input name="image_url" placeholder="Course Image URL (optional)" value={form.image_url} onChange={change} className="input-default" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="input-default file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="input-default" />

                <button disabled={loading} className="btn-primary text-on-primary">{loading ? "Saving..." : "Add Course"}</button>
            </form>
        </div>
    );
}

