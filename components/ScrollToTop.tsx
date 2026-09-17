"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    aria-label="Scroll to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                    className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/30 ring-1 ring-white/20 transition-colors hover:bg-brand-indigo md:bottom-6 md:right-24 md:h-12 md:w-12 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    <ArrowUp className="h-5 w-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
