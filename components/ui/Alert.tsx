import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warning" | "error";

const styles: Record<Variant, { wrapper: string; icon: typeof Info }> = {
	info: { wrapper: "border-blue-200 bg-blue-50 text-blue-800", icon: Info },
	success: { wrapper: "border-green-200 bg-green-50 text-green-800", icon: CheckCircle2 },
	warning: { wrapper: "border-yellow-200 bg-yellow-50 text-yellow-900", icon: AlertTriangle },
	error: { wrapper: "border-red-200 bg-red-50 text-red-800", icon: XCircle },
};

export type AlertProps = {
	variant?: Variant;
	title?: string;
	children?: ReactNode;
	className?: string;
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
	const { wrapper, icon: Icon } = styles[variant];
	return (
		<div
			role={variant === "error" ? "alert" : "status"}
			className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", wrapper, className)}
		>
			<Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
			<div>
				{title && <p className="font-semibold">{title}</p>}
				{children && <div className={cn(title && "mt-1")}>{children}</div>}
			</div>
		</div>
	);
}

export default Alert;
