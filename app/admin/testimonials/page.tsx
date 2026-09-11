"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestimonialsAdmin() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
            setItems(data || []);
        }

        load();
    }, []);

    async function toggle(id: string, active: boolean) {
        const { error } = await supabase.from("testimonials").update({ is_active: !active }).eq("id", id);
        if (error) return alert(error.message);
        setItems((s) => s.map((it) => (it.id === id ? { ...it, is_active: !active } : it)));
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">Testimonials</h2>

            <div className="grid md:grid-cols-2 gap-4">
                {items.map((t) => (
                    <div key={t.id} className="p-4 bg-white rounded shadow">
                        <div className="font-semibold text-blue-900">{t.name}</div>
                        <div className="text-sm text-gray-600">{t.course}</div>
                        <p className="mt-2 text-gray-700">{t.message}</p>
                        <div className="mt-3">
                            <button onClick={() => toggle(t.id, t.is_active)} className="px-3 py-1 rounded bg-yellow-400 text-blue-900">{t.is_active ? "Deactivate" : "Activate"}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

