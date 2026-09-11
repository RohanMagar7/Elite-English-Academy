
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

        const { error } = await supabase.from("notices").insert({
            title,
            description,
            category,
        });

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        alert("Notice Added!");

        setTitle("");
        setDescription("");
        setCategory("General");

        getNotices();
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
        <div className="min-h-screen bg-gray-100 p-8 space-y-8">

            <h1 className="text-3xl font-bold text-blue-900">
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
                    className="btn-accent text-blue-950"
                >
                    {loading ? "Saving..." : "Add Notice"}
                </button>
            </form>

            <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

                <table className="w-full">

                    <thead className="border-b">
                        <tr className="text-left text-gray-600">
                            <th className="py-3">Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice.id} className="border-b">

                                <td className="py-4">
                                    <h3 className="font-semibold">{notice.title}</h3>
                                    <p className="text-sm text-gray-500">
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
                                            : "bg-gray-500"
                                            }`}
                                    >
                                        {notice.is_active ? "Active" : "Hidden"}
                                    </button>
                                </td>

                                <td>
                                    <button
                                        onClick={() => deleteNotice(notice.id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}