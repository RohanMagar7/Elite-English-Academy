"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NoticeSection() {
    const [notices, setNotices] = useState<any[]>([]);
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();

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
        <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-center text-4xl font-bold text-blue-900 mb-10">
                    Latest Notices
                </h2>

                <div className="space-y-5">
                    {notices.map((notice, index) => (
                        <motion.div
                            key={notice.id}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: reduceMotion ? 0 : 0.45,
                                delay: reduceMotion ? 0 : index * 0.06,
                            }}
                            className="rounded-lg border-l-4 border-yellow-400 bg-blue-50 px-4 py-3 shadow-sm hover:shadow-md transition-all"
                        >
                            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-semibold text-blue-950">
                                {notice.category}
                            </span>

                            <h3 className="mt-2 text-lg font-bold leading-tight text-blue-900">
                                {notice.title}
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-gray-600 line-clamp-2">
                                {notice.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}