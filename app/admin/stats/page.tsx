"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
        if (!form.label) return alert("Label required");
        setLoading(true);
        const payload = { label: form.label, value: Number(form.value) || 0, suffix: form.suffix || "", icon: form.icon || "Sparkles", sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
        const { error } = editing ? await supabase.from("stats").update(payload).eq("id", editing) : await supabase.from("stats").insert([payload]);
        setLoading(false);
        if (error) return alert(error.message);
        setForm(EMPTY); setEditing(null); load();
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-blue-900">Homepage Stats</h1>
                <p className="text-gray-600">Manage animated number cards (icon names: GraduationCap, BookOpen, Laptop, Sparkles, BadgeCheck, Trophy).</p>
            </div>
            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="label" placeholder="Label (e.g. Happy Students)" value={form.label} onChange={change} className="input-default" required />
                <input name="value" type="number" placeholder="Value" value={form.value} onChange={change} className="input-default" />
                <input name="suffix" placeholder="Suffix (+, %)" value={form.suffix} onChange={change} className="input-default" />
                <input name="icon" placeholder="Icon name" value={form.icon} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Order" value={form.sort_order} onChange={change} className="input-default" />
                <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active</label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">{loading ? "Saving..." : editing ? "Update Stat" : "Add Stat"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-accent text-blue-950">Cancel</button>}
                </div>
            </form>
            <div className="grid gap-4 md:grid-cols-2">
                {items.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                        <div><p className="text-lg font-black text-blue-900">{s.value}{s.suffix}</p><p className="text-sm text-gray-600">{s.label} • {s.icon}</p></div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditing(s.id); setForm({ label: s.label, value: String(s.value), suffix: s.suffix || "", icon: s.icon || "Sparkles", sort_order: s.sort_order || 0, is_active: s.is_active ?? true }); }} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={async () => { await supabase.from("stats").update({ is_active: !s.is_active }).eq("id", s.id); load(); }} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">{s.is_active ? "Hide" : "Show"}</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await supabase.from("stats").delete().eq("id", s.id); load(); } }} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500 md:col-span-2">No stats yet.</p>}
            </div>
        </div>
    );
}
