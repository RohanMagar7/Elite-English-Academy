"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Story {
    id: string;
    student_name: string;
    course: string;
    before_result?: string | null;
    after_result?: string | null;
    achievement?: string | null;
    badge?: string | null;
    is_active?: boolean;
}

const EMPTY = {
    student_name: "",
    course: "",
    before_result: "",
    after_result: "",
    achievement: "",
    badge: "",
    is_active: true,
};

export default function SuccessStoriesAdmin() {
    const [items, setItems] = useState<Story[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    async function load() {
        const { data } = await supabase.from("success_stories").select("*").order("created_at", { ascending: false });
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
        if (!form.student_name || !form.course) {
            alert("Please provide the student name and course.");
            return;
        }
        setLoading(true);
        const payload = {
            student_name: form.student_name,
            course: form.course,
            before_result: form.before_result || null,
            after_result: form.after_result || null,
            achievement: form.achievement || null,
            badge: form.badge || null,
            is_active: form.is_active,
        };
        const { error } = editing
            ? await supabase.from("success_stories").update(payload).eq("id", editing)
            : await supabase.from("success_stories").insert([payload]);
        setLoading(false);
        if (error) return alert(error.message);
        alert(editing ? "Story updated." : "Story added.");
        setForm(EMPTY);
        setEditing(null);
        load();
    }

    function startEdit(story: Story) {
        setEditing(story.id);
        setForm({
            student_name: story.student_name,
            course: story.course,
            before_result: story.before_result || "",
            after_result: story.after_result || "",
            achievement: story.achievement || "",
            badge: story.badge || "",
            is_active: story.is_active ?? true,
        });
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from("success_stories").update({ is_active: !active }).eq("id", id);
        load();
    }

    async function remove(id: string) {
        if (!confirm("Delete this story?")) return;
        await supabase.from("success_stories").delete().eq("id", id);
        load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900">Success Stories</h1>

            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="student_name" placeholder="Student Name" value={form.student_name} onChange={change} className="input-default" required />
                <input name="course" placeholder="Course" value={form.course} onChange={change} className="input-default" required />
                <textarea name="before_result" placeholder="Before Result" rows={3} value={form.before_result} onChange={change} className="input-default" />
                <textarea name="after_result" placeholder="After Result" rows={3} value={form.after_result} onChange={change} className="input-default" />
                <input name="achievement" placeholder="Achievement (e.g., selected for BPO)" value={form.achievement} onChange={change} className="input-default" />
                <input name="badge" placeholder="Badge (e.g., IELTS 7.5)" value={form.badge} onChange={change} className="input-default" />
                <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">
                        {loading ? "Saving..." : editing ? "Update Story" : "Add Story"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-accent text-blue-950">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((story) => (
                    <div key={story.id} className="rounded-xl border bg-white p-4 shadow">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-blue-900">{story.student_name}</h3>
                                <p className="text-sm text-gray-600">{story.course}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${story.is_active ? "bg-green-600" : "bg-gray-500"}`}>
                                {story.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        {story.badge && <span className="mt-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-blue-950">{story.badge}</span>}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg bg-red-50 p-2 text-sm text-gray-600"><span className="font-bold text-red-500">Before: </span>{story.before_result || "—"}</div>
                            <div className="rounded-lg bg-green-50 p-2 text-sm text-gray-600"><span className="font-bold text-green-600">After: </span>{story.after_result || "—"}</div>
                        </div>
                        {story.achievement && <p className="mt-2 text-sm font-medium text-blue-900">🏆 {story.achievement}</p>}
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => startEdit(story)} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={() => toggle(story.id, !!story.is_active)} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">
                                {story.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(story.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-gray-500 md:col-span-2">No stories yet. Add your first success story above.</div>
                )}
            </div>
        </div>
    );
}