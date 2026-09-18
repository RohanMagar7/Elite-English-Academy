import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "blue" | "gold" | "green" | "gray" | "yellow" | "red";

const variants: Record<Variant, string> = {
	blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
	gold: "bg-yellow-400 text-blue-950 ring-1 ring-inset ring-yellow-300",
	green: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
	gray: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
	yellow: "bg-yellow-100 text-yellow-900 ring-1 ring-inset ring-yellow-200",
	red: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-200",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
	variant?: Variant;
};

export function Badge({ variant = "blue", className, children, ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}

export default Badge;
