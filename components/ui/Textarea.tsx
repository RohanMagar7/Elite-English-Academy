"use client";

import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Field } from "./Input";

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
		const autoId = useId();
		const textareaId = id ?? autoId;

		return (
			<Field
				label={label}
				hint={!error ? hint : undefined}
				error={error}
				required={required}
				htmlFor={textareaId}
				className={wrapperClassName}
				describedBy={error || hint ? `${textareaId}-desc` : undefined}
			>
				<textarea
					ref={ref}
					id={textareaId}
					required={required}
					aria-invalid={error ? true : undefined}
					aria-describedby={error || hint ? `${textareaId}-desc` : undefined}
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
