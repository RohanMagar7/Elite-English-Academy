"use client";
import { notify } from "@/components/ui/notify";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

export default function AddTestimonial() {
    const [form, setForm] = useState({ name: "", message: "", course: "", avatar: "", is_active: true });
    const [loading, setLoading] = useState(false);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const val = (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("testimonials").insert([{ name: form.name, message: form.message, course: form.course, avatar: form.avatar, is_active: form.is_active }]);
        setLoading(false);
        if (error) { notify.error(safeClientMessage(error, "Save failed. Please try again.")); return; }
        notify.success("Testimonial added.");
        setForm({ name: "", message: "", course: "", avatar: "", is_active: true });
    }

    return (
        <div className="max-w-3xl">
            <h2 className="admin-page-title">Add Testimonial</h2>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input name="name" placeholder="Name" value={form.name} onChange={change} className="input-default" required />
                <input name="course" placeholder="Course" value={form.course} onChange={change} className="input-default" />
                <input name="avatar" placeholder="Avatar URL" value={form.avatar} onChange={change} className="input-default" />
                <textarea name="message" rows={4} placeholder="Message" value={form.message} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>

                <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : "Add Testimonial"}</button>
            </form>
        </div>
    );
}
