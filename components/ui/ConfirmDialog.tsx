/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { Button } from "./Button";

export type ConfirmDialogProps = {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void | Promise<void>;
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Blocks the dialog + shows the spinner on the confirm button. */
	loading?: boolean;
};

/**
 * Standard destructive-action confirmation. Wire this to every delete /
 * deactivate action in the admin panel.
 */
export function ConfirmDialog({
	isOpen,
	onCancel,
	onConfirm,
	title = "Are you sure?",
	message,
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	loading = false,
}: ConfirmDialogProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			title={title}
			size="sm"
			footer={
				<>
					<Button variant="secondary" onClick={onCancel} disabled={loading}>
						{cancelLabel}
					</Button>
					<Button variant="danger" onClick={onConfirm} loading={loading}>
						{confirmLabel}
					</Button>
				</>
			}
		>
			<div className="flex items-start gap-3">
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
					<AlertTriangle className="h-5 w-5" aria-hidden />
				</span>
				<p className="text-sm leading-6 text-slate-700">{message}</p>
			</div>
		</Modal>
	);
}

export default ConfirmDialog;
