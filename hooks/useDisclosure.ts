"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseDisclosureResult {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

/** Small state helper for modals, drawers and menus. */
export function useDisclosure(initial = false): UseDisclosureResult {
	const [isOpen, setIsOpen] = useState(initial);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((v) => !v), []);

	return { isOpen, open, close, toggle };
}

/**
 * Locks body scroll while `locked` is true (mobile nav, lightbox, modal).
 * Restores the previous overflow value on unmount.
 */
export function useBodyScrollLock(locked: boolean): void {
	useEffect(() => {
		if (!locked) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [locked]);
}

/**
 * Calls `onEscape` when Escape is pressed while `active` is true.
 * Used by the Modal, gallery lightbox and similar overlays.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
	const handlerRef = useRef(onEscape);

	// Keep the latest handler without re-binding the key listener.
	useEffect(() => {
		handlerRef.current = onEscape;
	});

	useEffect(() => {
		if (!active) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handlerRef.current();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [active]);
}
