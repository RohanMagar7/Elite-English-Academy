"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

type Feature = { id: string; section_slug: string; title: string; description: string | null; icon: string | null; sort_order: number; is_active: boolean };
const EMPTY = { section_slug: "why-choose-us", title: "", description: "", icon: "BadgeCheck", sort_order: 0, is_active: true };

export default function FeaturesAdmin() {
    const [items, setItems] = useState<Feature[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    async function load() {
        const { data } = await supabase.from("features").select("*").order("sort_order");
        setItems((data as Feature[]) || []);
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
        const payload = { section_slug: form.section_slug || "why-choose-us", title: form.title, description: form.description || null, icon: form.icon || "BadgeCheck", sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
        const { error } = editing ? await supabase.from("features").update(payload).eq("id", editing) : await supabase.from("features").insert([payload]);
        setLoading(false);
        if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
        setForm(EMPTY); setEditing(null); load();
    }
    return (
        <div className="admin-page">
            <div>
                <h1 className="admin-page-title">Features / Why Choose Us / Services</h1>
                <p className="text-slate-600">Manage feature cards grouped by section slug (why-choose-us, services, or any new group).</p>
            </div>
            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="section_slug" placeholder="Group (why-choose-us / services)" value={form.section_slug} onChange={change} className="input-default" />
                <input name="title" placeholder="Title" value={form.title} onChange={change} className="input-default" required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={change} className="input-default md:col-span-2" rows={2} />
                <input name="icon" placeholder="Icon name (BadgeCheck, BookOpen...)" value={form.icon} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editing ? "Update Feature" : "Add Feature"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                </div>
            </form>
            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                {items.map((f) => (
                    <div key={f.id} className="admin-card">
                        <div className="flex items-start justify-between gap-3">
                            <div><p className="font-semibold text-blue-950">{f.title}</p><p className="text-xs text-slate-600">{f.section_slug} • {f.icon}</p></div>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${f.is_active ? "bg-green-600" : "bg-slate-500"}`}>{f.is_active ? "Active" : "Hidden"}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{f.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => { setEditing(f.id); setForm({ section_slug: f.section_slug || "why-choose-us", title: f.title, description: f.description || "", icon: f.icon || "BadgeCheck", sort_order: f.sort_order || 0, is_active: f.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={async () => { await supabase.from("features").update({ is_active: !f.is_active }).eq("id", f.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{f.is_active ? "Hide" : "Show"}</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("features").delete().eq("id", f.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="admin-empty md:col-span-2">No features yet.</p>}
            </div>
        </div>
    );
}