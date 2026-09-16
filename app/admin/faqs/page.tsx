"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Faq {
    id: string;
    question: string;
    answer: string;
    sort_order?: number;
    is_active?: boolean;
}

const EMPTY = { question: "", answer: "", sort_order: 0, is_active: true };

export default function FaqsAdmin() {
    const [items, setItems] = useState<Faq[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    async function load() {
        const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
        setItems(data || []);
    }

    useEffect(() => {
        load();
    }, []);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement;
        const val = target.type === "checkbox" ? target.checked : target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.question || !form.answer) {
            alert("Please fill in both question and answer.");
            return;
        }
        setLoading(true);
        const payload = {
            question: form.question,
            answer: form.answer,
            sort_order: Number(form.sort_order) || 0,
            is_active: form.is_active,
        };
        const { error } = editing
            ? await supabase.from("faqs").update(payload).eq("id", editing)
            : await supabase.from("faqs").insert([payload]);
        setLoading(false);
        if (error) return alert(error.message);
        alert(editing ? "FAQ updated." : "FAQ added.");
        setForm(EMPTY);
        setEditing(null);
        load();
    }

    function startEdit(faq: Faq) {
        setEditing(faq.id);
        setForm({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order || 0, is_active: faq.is_active ?? true });
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from("faqs").update({ is_active: !active }).eq("id", id);
        load();
    }

    async function remove(id: string) {
        if (!confirm("Delete this FAQ?")) return;
        await supabase.from("faqs").delete().eq("id", id);
        load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900">FAQs</h1>

            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow">
                <input name="question" placeholder="Question" value={form.question} onChange={change} className="input-default" required />
                <textarea name="answer" placeholder="Answer" rows={4} value={form.answer} onChange={change} className="input-default" required />
                <div className="flex flex-wrap items-center gap-4">
                    <input name="sort_order" type="number" placeholder="Sort Order" value={form.sort_order} onChange={change} className="input-default w-40" />
                    <label className="flex items-center gap-3">
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                    </label>
                </div>
                <div className="flex gap-3">
                    <button disabled={loading} className="btn-primary text-on-primary">
                        {loading ? "Saving..." : editing ? "Update FAQ" : "Add FAQ"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-accent text-blue-950">Cancel
                    </button>
                    )}
                </div>
            </form>

            <div className="space-y-3">
                {items.map((faq) => (
                    <div key={faq.id} className="rounded-xl border bg-white p-4 shadow">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-blue-900">{faq.question}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${faq.is_active ? "bg-green-600" : "bg-gray-500"}`}>
                                {faq.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => startEdit(faq)} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={() => toggle(faq.id, !!faq.is_active)} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">
                                {faq.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(faq.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-gray-500">No FAQs yet. Add your first FAQ above.</div>
                )}
            </div>
        </div>
    );
}