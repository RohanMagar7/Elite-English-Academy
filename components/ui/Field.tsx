/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { useId } from "react";
import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FieldProps = {
	label?: string;
	/** Extra text shown under the control (validation rules, format hints). */
	hint?: string;
	error?: string | null;
	required?: boolean;
	/** `id` of the controlled element, wired to the label's `htmlFor`. */
	htmlFor: string;
	/**
	 * `id` for the visible hint/error paragraph. Since the string is derived
	 * from the control id, `useFieldIds` builds it consistently for callers.
	 */
	describedBy?: string;
	children: ReactNode;
	className?: string;
};

/**
 * Shared label/hint/error shell for every form control.
 *
 * Rendering the message here (instead of inside `Input`/`Select`/`Textarea`)
 * keeps the accessibility contract in one place: the control owns
 * `aria-describedby`/`aria-invalid`, the wrapper owns the visible text they
 * point at.
 */
export function Field({
	label,
	hint,
	error,
	required,
	htmlFor,
	describedBy,
	children,
	className,
}: FieldProps) {
	return (
		<div className={cn("w-full", className)}>
			{label && (
				<label htmlFor={htmlFor} className="admin-label">
					{label}
					{required && (
						<span aria-hidden className="ml-0.5 text-red-600">
							*
						</span>
					)}
				</label>
			)}
			{children}
			{error ? (
				<p
					id={describedBy}
					role="alert"
					className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600"
				>
					<AlertCircle aria-hidden className="h-3.5 w-3.5" />
					{error}
				</p>
			) : hint ? (
				<p id={describedBy} className="admin-hint">
					{hint}
				</p>
			) : null}
		</div>
	);
}

/**
 * Derives the ids a form control needs, keeping the `htmlFor`/`aria-describedby`
 * pair impossible to get out of sync.
 *
 * Generate the id *inside* the hook call site so it stays stable across renders.
 */
export function useFieldIds(id?: string) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;
	// Message ids are namespaced off the field id, so two controls never clash.
	const messageId = `${fieldId}-desc`;
	return { fieldId, messageId };
}