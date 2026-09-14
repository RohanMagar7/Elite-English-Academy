import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
    variant?: Variant;
    className?: string;
};

const variantClasses: Record<Variant, string> = {
    primary:
        "inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    secondary:
        "inline-flex items-center justify-center rounded-xl border-2 border-green-500 bg-white px-5 py-3 text-sm font-semibold text-green-600 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
    ghost:
        "inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
};

export default function ActionLink({
    href,
    children,
    variant = "primary",
    className = "",
    target,
    rel,
    ...props
}: ActionLinkProps) {
    const classes = `${variantClasses[variant]} ${className}`.trim();

    if (href.startsWith("/")) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <a href={href} target={target} rel={rel} className={classes} {...props}>
            {children}
        </a>
    );
}
