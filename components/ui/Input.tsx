/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Field, useFieldIds } from "./Field";

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
	const { fieldId, messageId } = useFieldIds(id);
	// Hint is dropped when an error is shown, so `aria-describedby` only ever
	// points at text that is actually rendered.
	const describedBy = error || hint ? messageId : undefined;

	return (
		<Field
			label={label}
			hint={hint}
			error={error}
			required={required}
			htmlFor={fieldId}
			describedBy={describedBy}
			className={wrapperClassName}
		>
			<input
				ref={ref}
				id={fieldId}
				required={required}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				className={cn(
					"input-default",
					error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
					className,
				)}
				{...props}
			/>
		</Field>
	);
});

export default Input;
