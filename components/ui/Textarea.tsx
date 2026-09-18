/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Field, useFieldIds } from "./Field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	hint?: string;
	error?: string | null;
	wrapperClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea(
		{ label, hint, error, required, wrapperClassName, className, id, ...props },
		ref,
	) {
		const { fieldId, messageId } = useFieldIds(id);
		const describedBy = error || hint ? messageId : undefined;

		return (
			<Field
				label={label}
				hint={hint}
				error={error}
				required={required}
				htmlFor={fieldId}
				className={wrapperClassName}
				describedBy={describedBy}
			>
				<textarea
					ref={ref}
					id={fieldId}
					required={required}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					className={cn(
						"input-default min-h-24 resize-y",
						error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
						className,
					)}
					{...props}
				/>
			</Field>
		);
	},
);

export default Textarea;
