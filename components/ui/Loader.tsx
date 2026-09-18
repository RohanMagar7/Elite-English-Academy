/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoaderBlockProps = {
	className?: string;
	label?: string;
};

/** Full-block loader for page, card and section areas. */
export function LoaderBlock({ label = "Loading", className }: LoaderBlockProps) {
	return (
		<div role="status" aria-label={label} className={cn("flex items-center justify-center py-12", className)}>
			<Loader2 aria-hidden className="h-8 w-8 animate-spin text-blue-600" />
		</div>
	);
}

export default LoaderBlock;
