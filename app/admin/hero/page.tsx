"use client";
import { notify } from "@/components/ui/notify";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadSiteImage } from "@/hooks/useSiteSettings";
import { safeClientMessage } from "@/lib/client-errors";

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
        if (!form.title) { notify.warning("Title required"); return; }
        setLoading(true);
        try {
            let img = form.image_url.trim() || null;
            if (file) img = await uploadSiteImage(file, "hero");
            const payload = { badge: form.badge || null, title: form.title, description: form.description || null, image_url: img, primary_button_text: form.primary_button_text || null, primary_button_link: form.primary_button_link || null, secondary_button_text: form.secondary_button_text || null, secondary_button_link: form.secondary_button_link || null, sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
            const { error } = editing ? await supabase.from("hero_slides").update(payload).eq("id", editing) : await supabase.from("hero_slides").insert([payload]);
            if (error) { notify.error(safeClientMessage(error, "Save failed. Please try again.")); return; }
            setForm(EMPTY); setFile(null); setEditing(null); load();
        } catch (err) { notify.error(safeClientMessage(err, "Save failed")); }
        finally { setLoading(false); }
    }

    return (
        <div className="admin-page">
            <div>
                <h1 className="admin-page-title">Banners / Hero</h1>
                <p className="text-slate-600">Manage homepage banner text, images and buttons.</p>
            </div>
            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="badge" placeholder="Badge (e.g. Admissions Open 2026)" value={form.badge} onChange={change} className="input-default md:col-span-2" />
                <input name="title" placeholder="Title" value={form.title} onChange={change} className="input-default md:col-span-2" required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="input-default md:col-span-2" rows={3} />
                <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={change} className="input-default" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-default" />
                <input name="primary_button_text" placeholder="Primary button text" value={form.primary_button_text} onChange={change} className="input-default" />
                <input name="primary_button_link" placeholder="Primary button link" value={form.primary_button_link} onChange={change} className="input-default" />
                <input name="secondary_button_text" placeholder="Secondary button text" value={form.secondary_button_text} onChange={change} className="input-default" />
                <input name="secondary_button_link" placeholder="Secondary button link" value={form.secondary_button_link} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editing ? "Update Banner" : "Add Banner"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); setFile(null); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                </div>
            </form>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                {items.map((h) => (
                    <div key={h.id} className="admin-card">
                        {h.image_url ? <img src={h.image_url} alt={h.title} className="mb-3 h-40 w-full rounded-lg object-cover" /> : null}
                        <p className="text-xs font-bold uppercase text-blue-600">{h.badge}</p>
                        <h3 className="font-bold text-blue-950">{h.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{h.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => { setEditing(h.id); setForm({ badge: h.badge || "", title: h.title, description: h.description || "", image_url: h.image_url || "", primary_button_text: h.primary_button_text || "", primary_button_link: h.primary_button_link || "", secondary_button_text: h.secondary_button_text || "", secondary_button_link: h.secondary_button_link || "", sort_order: h.sort_order || 0, is_active: h.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={async () => { await supabase.from("hero_slides").update({ is_active: !h.is_active }).eq("id", h.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{h.is_active ? "Hide" : "Show"}</button>
                            <button onClick={async () => { if (await confirmDialog({ message: "Delete?", tone: "danger" })) { await supabase.from("hero_slides").delete().eq("id", h.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="admin-empty md:col-span-2">No banners yet.</p>}
            </div>
        </div>
    );
}