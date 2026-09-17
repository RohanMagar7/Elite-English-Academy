"use client";
import { notify } from "@/components/ui/notify";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

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
        if (error) { notify.error(safeClientMessage(error, "Save failed. Please try again.")); return; }
        notify.success("Image added to gallery.");
        setForm({ title: "", image_url: "" });
    }

    return (
        <div className="max-w-3xl">
            <h2 className="admin-page-title">Upload Gallery Image</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="title" placeholder="Image Title" value={form.title} onChange={change} className="input-default" />
                <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={change} className="input-default" required />
                <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Uploading..." : "Upload"}</button>
            </form>
        </div>
    );
}
