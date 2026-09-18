"use client";

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field } from "./Input";

export type SelectOption = { label: string; value: string; disabled?: boolean };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	hint?: string;
	error?: string | null;
	/** Simple string list, or `{ label, value }` pairs. */
	options: (string | SelectOption)[];
	placeholder?: string;
	wrapperClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select(
		{ label, hint, error, required, options, placeholder, wrapperClassName, className, id, children, ...props },
		ref,
	) {
		const autoId = useId();
		const selectId = id ?? autoId;

		return (
			<Field
				label={label}
				hint={!error ? hint : undefined}
				error={error}
				required={required}
				htmlFor={selectId}
				className={wrapperClassName}
				describedBy={error || hint ? `${selectId}-desc` : undefined}
			>
				<span className="relative block">
					<select
						ref={ref}
						id={selectId}
						required={required}
						aria-invalid={error ? true : undefined}
						aria-describedby={error || hint ? `${selectId}-desc` : undefined}
						className={cn(
							"input-default appearance-none",
							error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
							className,
						)}
						{...props}
					>
						{placeholder && (
							<option value="" disabled={required}>
								{placeholder}
							</option>
						)}
						{options.map((opt) =>
							typeof opt === "string" ? (
								<option key={opt} value={opt}>{opt}</option>
							) : (
								<option key={opt.value} value={opt.value} disabled={opt.disabled}>
									{opt.label}
								</option>
							),
						)}
						{children}
					</select>
					<ChevronDown
						aria-hidden
						className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
					/>
				</span>
			</Field>
		);
	},
);

export default Select;
