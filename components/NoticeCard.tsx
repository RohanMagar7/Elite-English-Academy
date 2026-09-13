"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NoticeSection() {
    const [notices, setNotices] = useState<any[]>([]);
    const shouldReduceMotion = useReducedMotion();

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
                    {notices.map((notice, index) => (
                        <motion.div
                            key={notice.id}
                            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                            className="rounded-xl border-l-4 border-yellow-400 bg-blue-50 p-5 shadow"
                        >
                            <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-blue-950">
                                {notice.category}
                            </span>

                            <h3 className="mt-3 text-2xl font-bold text-blue-900">
                                {notice.title}
                            </h3>

                            <p className="mt-2 text-gray-600">{notice.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}