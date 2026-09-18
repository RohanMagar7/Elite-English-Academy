/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has been scrolled past `threshold` px.
 * Shared by Navbar, ScrollToTop and FloatingWhatsApp (one listener,
 * passive, and SSR-safe).
 */
export function useScrolled(threshold = 40): boolean {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold]);

	return scrolled;
}
