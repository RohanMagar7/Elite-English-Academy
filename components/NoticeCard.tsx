"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NoticeSection() {
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("notices")
                .select("*")
                .eq("is_active", true)
                .limit(3)
                .order("created_at", { ascending: false });

            setNotices(data || []);
        }

        load();
    }, []);

    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-center text-4xl font-bold text-blue-900 mb-10">
                    Latest Notices
                </h2>

                <div className="space-y-5">
                    {notices.map((notice) => (
                        <div key={notice.id} className="rounded-xl border-l-4 border-yellow-400 bg-blue-50 p-5 shadow">
                            <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-blue-950">
                                {notice.category}
                            </span>

                            <h3 className="mt-3 text-2xl font-bold text-blue-900">
                                {notice.title}
                            </h3>

                            <p className="mt-2 text-gray-600">{notice.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}