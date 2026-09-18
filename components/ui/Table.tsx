/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import type { HTMLAttributes, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Thin semantic wrappers over the `.admin-table` styles defined in
 * globals.css. Pages describe columns/rows; this owns the markup
 * contract (responsive scroll wrapper, sticky-style header, hover rows).
 */

export function Table({ children, className, ...props }: HTMLAttributes<HTMLTableElement>) {
	return (
		<div className="admin-table-wrap">
			<table className={cn("admin-table", className)} {...props}>
				{children}
			</table>
		</div>
	);
}

export function TableHead({ children }: { children: ReactNode }) {
	return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
	return <tbody>{children}</tbody>;
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
	return <tr className={className}>{children}</tr>;
}

export function Th({ children, className, scope = "col", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th scope={scope} className={className} {...props}>
			{children}
		</th>
	);
}

export function Td({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td className={className} {...props}>
			{children}
		</td>
	);
}

export default Table;
