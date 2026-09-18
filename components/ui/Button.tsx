"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
	primary:
		"bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700",
	secondary:
		"border border-blue-600 bg-white text-blue-700 shadow-sm hover:bg-blue-50",
	accent:
		"bg-yellow-400 text-blue-950 shadow-md shadow-yellow-400/20 hover:bg-yellow-300",
	ghost:
		"border border-white/30 bg-white/10 text-white hover:bg-white/20",
	danger:
		"bg-red-600 text-white shadow-sm hover:bg-red-700",
};

const sizes: Record<Size, string> = {
	sm: "h-9 px-3.5 text-sm",
	md: "h-11 px-5 text-sm",
	lg: "h-12 px-6 text-base",
};

type ButtonBaseProps = {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
	/** Rendered before the label (e.g. icons). */
	leftIcon?: ReactNode;
	/** Rendered after the label (e.g. chevrons). */
	rightIcon?: ReactNode;
	children?: ReactNode;
};

export type ButtonProps = ButtonBaseProps &
	ButtonHTMLAttributes<HTMLButtonElement>;

function buttonClasses({
	variant = "primary",
	size = "md",
	className,
}: Pick<ButtonBaseProps, "variant" | "size"> & { className?: string }) {
	return cn(base, variants[variant], sizes[size], className);
}

function inner({
	loading,
	leftIcon,
	rightIcon,
	children,
}: ButtonBaseProps) {
	if (loading) {
		return (
			<>
				<Loader2 aria-hidden className="h-4 w-4 animate-spin" />
				<span>Please wait…</span>
			</>
		);
	}
	return (
		<>
			{leftIcon}
			{children}
			{rightIcon}
		</>
	);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{ variant, size, loading, leftIcon, rightIcon, className, disabled, children, ...props },
		ref,
	) {
		return (
			<button
				ref={ref}
				disabled={disabled || loading}
				className={buttonClasses({ variant, size, className })}
				{...props}
			>
				{inner({ loading, leftIcon, rightIcon, children })}
			</button>
		);
	},
);

export default Button;
