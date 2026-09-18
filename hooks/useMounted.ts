"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion flag.
 *
 * framer-motion's `useReducedMotion()` reads `window.matchMedia` during render,
 * which does not exist on the server - so it returns a different value on the
 * first client render than during SSR, causing hydration attribute mismatches
 * on every `motion.*` element. This hook instead returns `false` during SSR and
 * the first client render (matching SSR), then syncs with the real OS setting
 * after mount inside `useEffect` (which never affects SSR output), and keeps
 * listening for OS-setting changes.
 */
export function useSafeReducedMotion(): boolean {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduceMotion(query.matches);
        // Initial sync must happen synchronously on mount; later updates come from the listener.
        update();
        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", update);
            return () => query.removeEventListener("change", update);
        }
        // Fallback for older browsers.
        query.addListener(update);
        return () => query.removeListener(update);
    }, []);

    return reduceMotion;
}

/** Alias kept for older imports - identical behaviour. */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // By definition this hook flips state once after mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return mounted;
}

export default useSafeReducedMotion;