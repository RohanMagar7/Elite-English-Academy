"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadSiteImage } from "@/hooks/useSiteSettings";

type Hero = { id: string; badge: string | null; title: string; description: string | null; image_url: string | null; primary_button_text: string | null; primary_button_link: string | null; secondary_button_text: string | null; secondary_button_link: string | null; sort_order: number; is_active: boolean };
const EMPTY = { badge: "", title: "", description: "", image_url: "", primary_button_text: "Free Demo Class", primary_button_link: "/admission", secondary_button_text: "View Courses", secondary_button_link: "/courses", sort_order: 0, is_active: true };

export default function HeroAdmin() {
    const [items, setItems] = useState<Hero[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    async function load() {
        const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
        setItems((data as Hero[]) || []);
    }
    useEffect(() => { load(); }, []);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const t = e.target as HTMLInputElement;
        setForm({ ...form, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title) return alert("Title required");
        setLoading(true);
        try {
            let img = form.image_url.trim() || null;
            if (file) img = await uploadSiteImage(file, "hero");
            const payload = { badge: form.badge || null, title: form.title, description: form.description || null, image_url: img, primary_button_text: form.primary_button_text || null, primary_button_link: form.primary_button_link || null, secondary_button_text: form.secondary_button_text || null, secondary_button_link: form.secondary_button_link || null, sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
            const { error } = editing ? await supabase.from("hero_slides").update(payload).eq("id", editing) : await supabase.from("hero_slides").insert([payload]);
            if (error) return alert(error.message);
            setForm(EMPTY); setFile(null); setEditing(null); load();
        } catch (err) { alert(err instanceof Error ? err.message : "Save failed"); }
        finally { setLoading(false); }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-blue-900">Banners / Hero</h1>
                <p className="text-gray-600">Manage homepage banner text, images and buttons.</p>
            </div>
            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="badge" placeholder="Badge (e.g. Admissions Open 2026)" value={form.badge} onChange={change} className="input-default md:col-span-2" />
                <input name="title" placeholder="Title" value={form.title} onChange={change} className="input-default md:col-span-2" required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="input-default md:col-span-2" rows={3} />
                <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={change} className="input-default" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-default file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <input name="primary_button_text" placeholder="Primary button text" value={form.primary_button_text} onChange={change} className="input-default" />
                <input name="primary_button_link" placeholder="Primary button link" value={form.primary_button_link} onChange={change} className="input-default" />
                <input name="secondary_button_text" placeholder="Secondary button text" value={form.secondary_button_text} onChange={change} className="input-default" />
                <input name="secondary_button_link" placeholder="Secondary button link" value={form.secondary_button_link} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">{loading ? "Saving..." : editing ? "Update Banner" : "Add Banner"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); setFile(null); }} className="btn-accent text-blue-950">Cancel</button>}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((h) => (
                    <div key={h.id} className="rounded-xl border bg-white p-4 shadow">
                        {h.image_url ? <img src={h.image_url} alt={h.title} className="mb-3 h-40 w-full rounded-lg object-cover" /> : null}
                        <p className="text-xs font-bold uppercase text-blue-600">{h.badge}</p>
                        <h3 className="font-bold text-blue-900">{h.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{h.description}</p>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => { setEditing(h.id); setForm({ badge: h.badge || "", title: h.title, description: h.description || "", image_url: h.image_url || "", primary_button_text: h.primary_button_text || "", primary_button_link: h.primary_button_link || "", secondary_button_text: h.secondary_button_text || "", secondary_button_link: h.secondary_button_link || "", sort_order: h.sort_order || 0, is_active: h.is_active ?? true }); }} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={async () => { await supabase.from("hero_slides").update({ is_active: !h.is_active }).eq("id", h.id); load(); }} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">{h.is_active ? "Hide" : "Show"}</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("hero_slides").delete().eq("id", h.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500 md:col-span-2">No banners yet.</p>}
            </div>
        </div>
    );
}
