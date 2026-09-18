"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { EmptyState } from "@/components/ui";

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
    const { requestDelete, dialog } = useConfirmDelete<string>(
        async (id) => { await supabase.from("navigation_links").delete().eq("id", id); load(); },
        "Delete this navigation link?",
    );
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
        if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
        setForm(EMPTY); setEditing(null); load();
    }
    return (
        <div className="admin-page">
            {dialog}
            <div><h1 className="admin-page-title">Header & Navigation Menu</h1>
            <p className="text-slate-600">Add, edit, reorder, show/hide and delete menu links.</p></div>
            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="label" placeholder="Label (e.g. Courses)" value={form.label} onChange={change} className="input-default" required />
                <input name="href" placeholder="Link (e.g. /courses)" value={form.href} onChange={change} className="input-default" required />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editing ? "Update Link" : "Add Link"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                </div>
            </form>
            <div className="space-y-3">{items.map((n) => (
                <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                    <div><p className="font-semibold text-blue-950">{n.label}</p><p className="text-sm text-slate-600">{n.href} • order {n.sort_order}</p></div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditing(n.id); setForm({ label: n.label, href: n.href, sort_order: n.sort_order || 0, is_active: n.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                        <button onClick={async () => { await supabase.from("navigation_links").update({ is_active: !n.is_active }).eq("id", n.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{n.is_active ? "Hide" : "Show"}</button>
                        <button onClick={() => requestDelete(n.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                    </div>
                </div>))}
                {items.length === 0 && <EmptyState title="" className="p" />}
            </div>
        </div>
    );
}