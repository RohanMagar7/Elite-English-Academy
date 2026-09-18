"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBodyScrollLock, useEscapeKey } from "@/hooks/useDisclosure";

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	/** Optional visually-quiet sub-line under the title. */
	description?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizes = {
	sm: "max-w-md",
	md: "max-w-xl",
	lg: "max-w-3xl",
} as const;

/**
 * Accessible modal dialog: Escape-to-close, body scroll lock, focus moved
 * into the dialog on open, `role="dialog"` + `aria-modal`.
 */
export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	footer,
	size = "md",
	className,
}: ModalProps) {
	const panelRef = useRef<HTMLDivElement>(null);

	useBodyScrollLock(isOpen);
	useEscapeKey(isOpen, onClose);

	// Move focus into the dialog so keyboard users aren't stranded behind it.
	useEffect(() => {
		if (!isOpen) return;
		const first = panelRef.current?.querySelector<HTMLElement>(
			"input, select, textarea, button",
		);
		(first ?? panelRef.current)?.focus();
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-end justify-center bg-blue-950/50 p-4 backdrop-blur-sm sm:items-center"
			onClick={onClose}
		>
			<div
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				tabIndex={-1}
				onClick={(e) => e.stopPropagation()}
				className={cn(
					"w-full rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none",
					sizes[size],
					className,
				)}
			>
				<div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
					<div>
						<h2 id="modal-title" className="text-lg font-bold text-blue-950">
							{title}
						</h2>
						{description && (
							<p className="mt-0.5 text-sm text-slate-600">{description}</p>
						)}
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close dialog"
						className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">{children}</div>

				{footer && (
					<div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 p-4 sm:p-5">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}

export default Modal;
