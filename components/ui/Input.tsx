"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Field — label + hint + error wrapper shared by all form controls.  */
/* ------------------------------------------------------------------ */

interface FieldProps {
	label?: string;
	/** Extra text shown under the control (validation rules, format hints). */
	hint?: string;
	error?: string | null;
	required?: boolean;
	/** `id` of the controlled element, wired to label + aria-describedby. */
	htmlFor: string;
	/** `id` of the visible hint/error paragraph for aria-describedby. */
	describedBy?: string;
	children: ReactNode;
	className?: string;
}

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
					{required && <span aria-hidden className="ml-0.5 text-red-600">*</span>}
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
				<p id={describedBy} className="admin-hint">{hint}</p>
			) : null}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Input                                                              */
/* ------------------------------------------------------------------ */

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	hint?: string;
	error?: string | null;
	wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ label, hint, error, required, wrapperClassName, className, id, ...props },
	ref,
) {
	const autoId = useId();
	const inputId = id ?? autoId;

	return (
		<Field
			label={label}
			hint={!error ? hint : undefined}
			error={error}
			required={required}
			htmlFor={inputId}
			className={wrapperClassName}
			describedBy={error || hint ? `${inputId}-desc` : undefined}
		>
			<input
				ref={ref}
				id={inputId}
				required={required}
				aria-invalid={error ? true : undefined}
				aria-describedby={error || hint ? `${inputId}-desc` : undefined}
				className={cn("input-default", error && "border-red-500 focus:border-red-500 focus:ring-red-500/25", className)}
				{...props}
			/>
		</Field>
	);
});

export default Input;
