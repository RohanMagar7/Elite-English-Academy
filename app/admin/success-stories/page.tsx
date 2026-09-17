"use client";
import { notify } from "@/components/ui/notify";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

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
            notify.warning("Please provide the student name and course.");
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
        if (error) { notify.error(safeClientMessage(error, "Save failed. Please try again.")); return; }
        notify.success(editing ? "Story updated." : "Story added.");
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
        if (!(await confirmDialog({ message: "Delete this story?", tone: "danger" }))) return;
        await supabase.from("success_stories").delete().eq("id", id);
        load();
    }

    return (
        <div className="admin-page">
            <h1 className="admin-page-title">Success Stories</h1>

            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="student_name" placeholder="Student Name" value={form.student_name} onChange={change} className="input-default" required />
                <input name="course" placeholder="Course" value={form.course} onChange={change} className="input-default" required />
                <textarea name="before_result" placeholder="Before Result" rows={3} value={form.before_result} onChange={change} className="input-default" />
                <textarea name="after_result" placeholder="After Result" rows={3} value={form.after_result} onChange={change} className="input-default" />
                <input name="achievement" placeholder="Achievement (e.g., selected for BPO)" value={form.achievement} onChange={change} className="input-default" />
                <input name="badge" placeholder="Badge (e.g., IELTS 7.5)" value={form.badge} onChange={change} className="input-default" />
                <label className="admin-check-row md:col-span-2">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">
                        {loading ? "Saving..." : editing ? "Update Story" : "Add Story"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                {items.map((story) => (
                    <div key={story.id} className="admin-card">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-blue-950">{story.student_name}</h3>
                                <p className="text-sm text-slate-600">{story.course}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs text-white ${story.is_active ? "bg-green-600" : "bg-slate-500"}`}>
                                {story.is_active ? "Active" : "Hidden"}
                            </span>
                        </div>
                        {story.badge && <span className="mt-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-blue-950">{story.badge}</span>}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg bg-red-50 p-2 text-sm text-slate-600"><span className="font-bold text-red-500">Before: </span>{story.before_result || "—"}</div>
                            <div className="rounded-lg bg-green-50 p-2 text-sm text-slate-600"><span className="font-bold text-green-600">After: </span>{story.after_result || "—"}</div>
                        </div>
                        {story.achievement && <p className="mt-2 text-sm font-medium text-blue-950">🏆 {story.achievement}</p>}
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => startEdit(story)} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={() => toggle(story.id, !!story.is_active)} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">
                                {story.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(story.id)} className="admin-btn-sm bg-red-600 text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="admin-empty md:col-span-2">No stories yet. Add your first success story above.</div>
                )}
            </div>
        </div>
    );
}