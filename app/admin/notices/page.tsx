
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

interface Notice {
    id: string;
    title: string;
    description: string;
    category: string;
    is_active: boolean;
}

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function getNotices() {
        const { data } = await supabase
            .from("notices")
            .select("*")
            .order("created_at", { ascending: false });

        setNotices(data || []);
    }

    useEffect(() => {
        getNotices();
    }, []);

    async function addNotice(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);

        const { error } = editing
            ? await supabase.from("notices").update({ title, description, category }).eq("id", editing)
            : await supabase.from("notices").insert({
                title,
                description,
                category,
            });

        setLoading(false);

        if (error) {
            alert(safeClientMessage(error, "Save failed. Please try again."));
            return;
        }

        alert(editing ? "Notice updated!" : "Notice Added!");

        setTitle("");
        setDescription("");
        setCategory("General");
        setEditing(null);

        getNotices();
    }

    function startEdit(notice: Notice) {
        setEditing(notice.id);
        setTitle(notice.title);
        setDescription(notice.description || "");
        setCategory(notice.category || "General");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditing(null);
        setTitle("");
        setDescription("");
        setCategory("General");
    }

    async function deleteNotice(id: string) {
        if (!confirm("Delete notice?")) return;

        await supabase.from("notices").delete().eq("id", id);

        getNotices();
    }

    async function toggleNotice(id: string, active: boolean) {
        await supabase
            .from("notices")
            .update({ is_active: !active })
            .eq("id", id);

        getNotices();
    }

    return (
        <div className="admin-page">

            <h1 className="admin-page-title">
                Notice Management
            </h1>

            <form
                onSubmit={addNotice}
                className="bg-white rounded-xl shadow p-6 space-y-4"
            >
                <input
                    placeholder="Notice Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-default"
                    required
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-default"
                >
                    <option>General</option>
                    <option>Admission</option>
                    <option>Scholarship</option>
                    <option>Holiday</option>
                    <option>Event</option>
                </select>

                <textarea
                    placeholder="Notice Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="input-default"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="admin-btn-accent w-full sm:w-auto"
                >
                    {loading ? "Saving..." : editing ? "Update Notice" : "Add Notice"}
                </button>
                {editing && (
                    <button type="button" onClick={cancelEdit} className="admin-btn-primary w-full sm:w-auto">
                        Cancel
                    </button>
                )}
            </form>

            <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

                <table className="admin-table">

                    <thead className="admin-tbody-row">
                        <tr className="text-left text-slate-600">
                            <th className="py-3">Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice.id} className="admin-tbody-row">

                                <td className="py-4">
                                    <h3 className="font-semibold">{notice.title}</h3>
                                    <p className="text-sm text-slate-600">
                                        {notice.description}
                                    </p>
                                </td>

                                <td>
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                        {notice.category}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            toggleNotice(notice.id, notice.is_active)
                                        }
                                        className={`rounded-full px-3 py-1 text-white ${notice.is_active
                                            ? "bg-green-600"
                                            : "bg-slate-500"
                                            }`}
                                    >
                                        {notice.is_active ? "Active" : "Hidden"}
                                    </button>
                                </td>

                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(notice)}
                                            className="bg-yellow-400 text-blue-950 px-3 py-2 rounded-lg font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteNotice(notice.id)}
                                            className="admin-btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}