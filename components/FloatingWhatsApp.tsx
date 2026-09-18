"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

/**
 * Floating WhatsApp CTA. Hides while the user scrolls down (content-reading
 * mode) and reappears on scroll up / near the top. The previous Y position
 * lives in a ref so the passive scroll listener is bound exactly once.
 */
export default function FloatingWhatsApp() {
	const [visible, setVisible] = useState(true);
	const lastScrollY = useRef(0);
	const { settings } = useSiteSettings();

	useEffect(() => {
		const onScroll = () => {
			const currentY = window.scrollY;
			setVisible(currentY <= 120 || currentY <= lastScrollY.current);
			lastScrollY.current = currentY;
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<a
			href={whatsappLink(settings.whatsapp_number)}
			target="_blank"
			rel="noreferrer"
			aria-label="Chat with us on WhatsApp"
			className={`floating-whatsapp fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-300 ease-in-out md:bottom-6 md:right-6 md:h-16 md:w-16 ${
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
			}`}
		>
			<MessageCircle className="h-6 w-6 md:h-7 md:w-7" aria-hidden />
		</a>
	);
}
