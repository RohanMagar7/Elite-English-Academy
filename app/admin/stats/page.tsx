"use client";
import { notify } from "@/components/ui/notify";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

type Stat = { id: string; label: string; value: number; suffix: string | null; icon: string | null; sort_order: number; is_active: boolean };
const EMPTY = { label: "", value: "0", suffix: "", icon: "Sparkles", sort_order: 0, is_active: true };

export default function StatsAdmin() {
    const [items, setItems] = useState<Stat[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    async function load() {
        const { data } = await supabase.from("stats").select("*").order("sort_order");
        setItems((data as Stat[]) || []);
    }
    useEffect(() => { load(); }, []);
    function change(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target as HTMLInputElement;
        setForm({ ...form, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.label) { notify.warning("Label required"); return; }
        setLoading(true);
        const payload = { label: form.label, value: Number(form.value) || 0, suffix: form.suffix || "", icon: form.icon || "Sparkles", sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
        const { error } = editing ? await supabase.from("stats").update(payload).eq("id", editing) : await supabase.from("stats").insert([payload]);
        setLoading(false);
        if (error) { notify.error(safeClientMessage(error, "Save failed. Please try again.")); return; }
        setForm(EMPTY); setEditing(null); load();
    }
    return (
        <div className="admin-page">
            <div>
                <h1 className="admin-page-title">Homepage Stats</h1>
                <p className="text-slate-600">Manage animated number cards (icon names: GraduationCap, BookOpen, Laptop, Sparkles, BadgeCheck, Trophy).</p>
            </div>
            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="label" placeholder="Label (e.g. Happy Students)" value={form.label} onChange={change} className="input-default" required />
                <input name="value" type="number" placeholder="Value" value={form.value} onChange={change} className="input-default" />
                <input name="suffix" placeholder="Suffix (+, %)" value={form.suffix} onChange={change} className="input-default" />
                <input name="icon" placeholder="Icon name" value={form.icon} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editing ? "Update Stat" : "Add Stat"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                </div>
            </form>
            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                {items.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                        <div><p className="text-lg font-black text-blue-950">{s.value}{s.suffix}</p><p className="text-sm text-slate-600">{s.label} • {s.icon}</p></div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditing(s.id); setForm({ label: s.label, value: String(s.value), suffix: s.suffix || "", icon: s.icon || "Sparkles", sort_order: s.sort_order || 0, is_active: s.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={async () => { await supabase.from("stats").update({ is_active: !s.is_active }).eq("id", s.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{s.is_active ? "Hide" : "Show"}</button>
                            <button onClick={async () => { if (await confirmDialog({ message: "Delete?", tone: "danger" })) { await supabase.from("stats").delete().eq("id", s.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="admin-empty md:col-span-2">No stats yet.</p>}
            </div>
        </div>
    );
}