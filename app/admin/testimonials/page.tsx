"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadSiteImage } from "@/hooks/useSiteSettings";

interface Testimonial {
    id: string;
    name: string;
    course: string | null;
    message: string;
    rating: number | null;
    avatar: string | null;
    is_active: boolean;
}

const EMPTY = { name: "", course: "", message: "", rating: "5", avatar: "", is_active: true };

export default function TestimonialsAdmin() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    async function load() {
        const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
        setItems((data as Testimonial[]) || []);
    }

    useEffect(() => {
        load();
    }, []);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const t = e.target as HTMLInputElement;
        setForm({ ...form, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.message) {
            alert("Name and message are required.");
            return;
        }
        setLoading(true);
        try {
            let avatar = form.avatar.trim() || null;
            if (file) avatar = await uploadSiteImage(file, "testimonials");
            const payload = {
                name: form.name,
                course: form.course || "General English",
                message: form.message,
                rating: Number(form.rating) || 5,
                avatar,
                is_active: form.is_active,
            };
            const { error } = editing
                ? await supabase.from("testimonials").update(payload).eq("id", editing)
                : await supabase.from("testimonials").insert([payload]);
            if (error) return alert(error.message);
            alert(editing ? "Testimonial updated." : "Testimonial added.");
            setForm(EMPTY);
            setFile(null);
            setEditing(null);
            load();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setLoading(false);
        }
    }
    function startEdit(t: Testimonial) {
        setEditing(t.id);
        setForm({
            name: t.name,
            course: t.course || "",
            message: t.message,
            rating: String(t.rating ?? 5),
            avatar: t.avatar || "",
            is_active: t.is_active ?? true,
        });
        setFile(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditing(null);
        setForm(EMPTY);
        setFile(null);
    }

    async function toggle(id: string, active: boolean) {
        const { error } = await supabase.from("testimonials").update({ is_active: !active }).eq("id", id);
        if (error) return alert(error.message);
        load();
    }

    async function remove(id: string) {
        if (!confirm("Delete this testimonial?")) return;
        await supabase.from("testimonials").delete().eq("id", id);
        load();
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-blue-900">Testimonials</h1>
                <p className="text-gray-600">Add, edit, approve, hide and delete student reviews.</p>
            </div>

            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="name" placeholder="Student Name" value={form.name} onChange={change} className="input-default" required />
                <input name="course" placeholder="Course (e.g. Spoken English)" value={form.course} onChange={change} className="input-default" />
                <textarea name="message" rows={3} placeholder="Review message" value={form.message} onChange={change} className="input-default md:col-span-2" required />
                <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" value={form.rating} onChange={change} className="input-default" />
                <input name="avatar" placeholder="Avatar URL (optional)" value={form.avatar} onChange={change} className="input-default" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-default file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <label className="flex items-center gap-3">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">
                        {loading ? "Saving..." : editing ? "Update Testimonial" : "Add Testimonial"}
                    </button>
                    {editing && (
                        <button type="button" onClick={cancelEdit} className="btn-accent text-blue-950">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((t) => (
                    <div key={t.id} className="p-4 bg-white rounded-xl shadow">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="font-semibold text-blue-900">{t.name}</div>
                                <div className="text-sm text-gray-600">{t.course} • {"★".repeat(t.rating || 5)}</div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${t.is_active ? "bg-green-600" : "bg-gray-500"}`}>
                                {t.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-700">{t.message}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => startEdit(t)} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={() => toggle(t.id, t.is_active)} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">
                                {t.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(t.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500 md:col-span-2">No testimonials yet.</p>
                )}
            </div>
        </div>
    );
}



