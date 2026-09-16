"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Batch {
    id: string;
    name: string;
    time: string;
    days: string;
    level: string;
    mode: string;
    description?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

const EMPTY = {
    id: "",
    name: "",
    time: "",
    days: "",
    level: "",
    mode: "",
    description: "",
    sort_order: 0,
    is_active: true,
};

export default function BatchesAdmin() {
    const [items, setItems] = useState<Batch[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    async function load() {
        const { data } = await supabase
            .from("batches")
            .select("*")
            .order("sort_order", { ascending: true });
        setItems(data || []);
    }

    useEffect(() => {
        load();
    }, []);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = e.target as HTMLInputElement;
        const val = target.type === "checkbox" ? target.checked : target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.time) {
            alert("Please enter a batch name and time.");
            return;
        }
        setLoading(true);

        const payload = {
            name: form.name,
            time: form.time,
            days: form.days,
            level: form.level,
            mode: form.mode,
            description: form.description,
            sort_order: Number(form.sort_order) || 0,
            is_active: form.is_active,
        };

        const { error } = editing
            ? await supabase.from("batches").update(payload).eq("id", editing)
            : await supabase.from("batches").insert([payload]);

        setLoading(false);
        if (error) return alert(error.message);

        alert(editing ? "Batch updated." : "Batch added.");
        setForm(EMPTY);
        setEditing(null);
        load();
    }

    function startEdit(batch: Batch) {
        setEditing(batch.id);
        setForm({
            id: batch.id,
            name: batch.name,
            time: batch.time,
            days: batch.days,
            level: batch.level,
            mode: batch.mode,
            description: batch.description || "",
            sort_order: batch.sort_order || 0,
            is_active: batch.is_active ?? true,
        });
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from("batches").update({ is_active: !active }).eq("id", id);
        load();
    }

    async function remove(id: string) {
        if (!confirm("Delete this batch?")) return;
        await supabase.from("batches").delete().eq("id", id);
        load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900">Batch Timings</h1>

            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="name" placeholder="Batch Name (e.g., Morning)" value={form.name} onChange={change} className="input-default" required />
                <input name="time" placeholder="Time (e.g., 7:00 AM – 10:00 AM)" value={form.time} onChange={change} className="input-default" required />
                <input name="days" placeholder="Days (e.g., Mon – Sat)" value={form.days} onChange={change} className="input-default" />
                <input name="level" placeholder="Level / Audience" value={form.level} onChange={change} className="input-default" />
                <input name="mode" placeholder="Mode (Offline / Online)" value={form.mode} onChange={change} className="input-default" />
                <input name="sort_order" type="number" placeholder="Sort Order" value={form.sort_order} onChange={change} className="input-default" />
                <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={change} className="input-default md:col-span-2" />
                <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} />
                    Active
                </label>
                <div className="md:col-span-2 flex gap-3">
                    <button disabled={loading} className="btn-primary text-on-primary">
                        {loading ? "Saving..." : editing ? "Update Batch" : "Add Batch"}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(null);
                                setForm(EMPTY);
                            }}
                            className="btn-accent text-blue-950"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((batch) => (
                    <div key={batch.id} className="rounded-xl border bg-white p-4 shadow">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-blue-900">{batch.name}</h3>
                                <p className="text-sm text-gray-600">{batch.time} — {batch.days}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${batch.is_active ? "bg-green-600" : "bg-gray-500"}`}>
                                {batch.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{batch.level} • {batch.mode}</p>
                        {batch.description && <p className="mt-2 text-sm text-gray-500">{batch.description}</p>}
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => startEdit(batch)} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={() => toggle(batch.id, !!batch.is_active)} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">
                                {batch.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(batch.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-gray-500 md:col-span-2">
                        No batches yet. Add your first batch above.
                    </div>
                )}
            </div>
        </div>
    );
}