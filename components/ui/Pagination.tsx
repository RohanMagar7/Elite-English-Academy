"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
	className?: string;
};

/**
 * Numberless, accessible pagination (prev / "x of y" / next).
 * Both controls are disabled at the bounds and announced via aria.
 */
export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<nav
			aria-label="Pagination"
			className={className ?? "flex items-center justify-center gap-3 py-4"}
		>
			<button
				type="button"
				onClick={() => onChange(page - 1)}
				disabled={page <= 1}
				aria-label="Previous page"
				className="admin-btn-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
			>
				<ChevronLeft className="h-4 w-4" aria-hidden />
				Prev
			</button>

			<span aria-live="polite" className="text-sm font-medium text-slate-600">
				Page <strong className="text-blue-950">{page}</strong> of {totalPages}
			</span>

			<button
				type="button"
				onClick={() => onChange(page + 1)}
				disabled={page >= totalPages}
				aria-label="Next page"
				className="admin-btn-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
			>
				Next
				<ChevronRight className="h-4 w-4" aria-hidden />
			</button>
		</nav>
	);
}

export default Pagination;
