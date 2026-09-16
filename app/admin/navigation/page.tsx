"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Nav = { id: string; label: string; href: string; sort_order: number; is_active: boolean };
const EMPTY = { label: "", href: "", sort_order: 0, is_active: true };

export default function NavigationAdmin() {
    const [items, setItems] = useState<Nav[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    async function load() {
        const { data } = await supabase.from("navigation_links").select("*").order("sort_order");
        setItems((data as Nav[]) || []);
    }
    useEffect(() => { load(); }, []);
    function change(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target as HTMLInputElement;
        setForm({ ...form, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.label || !form.href) return alert("Label and link required");
        setLoading(true);
        const payload = { label: form.label, href: form.href, sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
        const { error } = editing ? await supabase.from("navigation_links").update(payload).eq("id", editing) : await supabase.from("navigation_links").insert([payload]);
        setLoading(false);
        if (error) return alert(error.message);
        setForm(EMPTY); setEditing(null); load();
    }
    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-blue-900">Header & Navigation Menu</h1>
            <p className="text-gray-600">Add, edit, reorder, show/hide and delete menu links.</p></div>
            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="label" placeholder="Label (e.g. Courses)" value={form.label} onChange={change} className="input-default" required />
                <input name="href" placeholder="Link (e.g. /courses)" value={form.href} onChange={change} className="input-default" required />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">{loading ? "Saving..." : editing ? "Update Link" : "Add Link"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-accent text-blue-950">Cancel</button>}
                </div>
            </form>
            <div className="space-y-3">{items.map((n) => (
                <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                    <div><p className="font-semibold text-blue-900">{n.label}</p><p className="text-sm text-gray-500">{n.href} • order {n.sort_order}</p></div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditing(n.id); setForm({ label: n.label, href: n.href, sort_order: n.sort_order || 0, is_active: n.is_active ?? true }); }} className="btn-accent text-blue-950">Edit</button>
                        <button onClick={async () => { await supabase.from("navigation_links").update({ is_active: !n.is_active }).eq("id", n.id); load(); }} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">{n.is_active ? "Hide" : "Show"}</button>
                        <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("navigation_links").delete().eq("id", n.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                    </div>
                </div>))}
                {items.length === 0 && <p className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500">No links yet.</p>}
            </div>
        </div>
    );
}
