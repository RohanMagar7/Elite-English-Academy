/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { faqSchema, idSchema } from "@/lib/validation";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";

async function mutate(op: "create" | "update" | "delete" | "toggle", payload: Record<string, unknown>): Promise<string | null> {
    try {
        const res = await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ op, table: "faqs", ...payload }),
        });
        if (res.ok) return null;
        const data = await res.json().catch(() => ({}));
        return (data.error as string) ?? "Save failed.";
    } catch {
        return "Unable to reach the server.";
    }
}

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
        // STRICT client check with the same schema the server enforces.
        const parsed = faqSchema.safeParse({ ...form, sort_order: Number(form.sort_order) });
        if (!parsed.success) {
            alert(parsed.error.issues[0]?.message ?? "Please check the form fields.");
            return;
        }
        setLoading(true);
        const err = editing
            ? await mutate("update", { id: editing, data: parsed.data })
            : await mutate("create", { data: parsed.data });
        setLoading(false);
        if (err) return alert(err);
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
        if (!idSchema.safeParse(id).success) return alert("Invalid id.");
        const err = await mutate("toggle", { id, is_active: active });
        if (err) return alert(err);
        load();
    }

    const { requestDelete, dialog } = useConfirmDelete<string>(
        async (id) => {
        if (!idSchema.safeParse(id).success) return alert("Invalid id.");
        const err = await mutate("delete", { id });
        if (err) return alert(err);
        load();
        },
        "Delete this FAQ?",
    );

    return (
        <div className="admin-page">
            {dialog}
            <h1 className="admin-page-title">FAQs</h1>

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
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">
                        {loading ? "Saving..." : editing ? "Update FAQ" : "Add FAQ"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="admin-btn-accent w-full sm:w-auto">Cancel
                    </button>
                    )}
                </div>
            </form>

            <div className="space-y-3">
                {items.map((faq) => (
                    <div key={faq.id} className="admin-card">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-blue-950">{faq.question}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${faq.is_active ? "bg-green-600" : "bg-slate-500"}`}>
                                {faq.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => startEdit(faq)} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={() => toggle(faq.id, !!faq.is_active)} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">
                                {faq.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => requestDelete(faq.id)} className="admin-btn-sm bg-red-600 text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-600">No FAQs yet. Add your first FAQ above.</div>
                )}
            </div>
        </div>
    );
}