import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
	title: string;
	description?: string;
	/** Optional call-to-action (usually a Button) rendered under the text. */
	action?: ReactNode;
	icon?: ReactNode;
	className?: string;
};

export function EmptyState({
	title,
	description,
	action,
	icon,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center",
				className,
			)}
		>
			<span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
				{icon ?? <Inbox className="h-5 w-5" aria-hidden />}
			</span>
			<p className="font-semibold text-slate-800">{title}</p>
			{description && <p className="max-w-sm text-sm text-slate-600">{description}</p>}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}

export default EmptyState;
