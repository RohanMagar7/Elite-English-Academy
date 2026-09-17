"use client";

import { motion } from "framer-motion";
import { Megaphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";

export default function AnnouncementBanner() {
    const { settings } = useSiteSettings();
    const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);
    const [hidden, setHidden] = useState(false);
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("notices")
                .select("title, description")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const { title, description } = data[0];
                setNotice({ title, description });
            } else {
                // Fallback: announcement text managed in Admin → Settings
                if (settings.announcement_title) {
                    setNotice({
                        title: settings.announcement_title,
                        description: settings.announcement_text || "",
                    });
                }
            }
        }

        load();
    }, [settings.announcement_title, settings.announcement_text]);

    if (hidden || !notice) return null;

    return (
        <motion.div
            initial={reduceMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : undefined}
            className="z-50 bg-yellow-400 text-blue-950"
        >
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
                <Megaphone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <p className="flex-1 truncate text-xs text-blue-950 font-semibold sm:text-sm">
                    <span className="font-black">
                        {notice.title}
                    </span>
                    {notice.description ? ` — ${notice.description}` : ""}
                </p>
                <button
                    type="button"
                    aria-label="Dismiss announcement"
                    onClick={() => setHidden(true)}
                    className="shrink-0 rounded-full p-1 transition hover:bg-yellow-300"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}