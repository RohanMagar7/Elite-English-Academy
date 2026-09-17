"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";
import { useSafeReducedMotion } from "@/hooks/useMounted";

export default function FloatingWhatsApp() {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { settings } = useSiteSettings();
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > 120 && currentY > lastScrollY) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <motion.a
            href={whatsappLink(settings.whatsapp_number)}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { scale: [0, 1.15, 1], opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduceMotion ? undefined : { scale: 1.1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_30px_rgba(37,211,102,0.35)] ring-1 ring-white/20 transition-opacity duration-300 ease-in-out md:bottom-6 md:right-6 md:h-16 md:w-16 ${visible ? "opacity-100" : "pointer-events-none opacity-0"
                } floating-whatsapp`}
        >
            <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        </motion.a>
    );
}
