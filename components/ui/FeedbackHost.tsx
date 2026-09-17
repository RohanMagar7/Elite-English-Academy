"use client";

/**
 * Mounted once in the root layout: premium toast viewport (sonner)
 * + the promise-based confirm dialog host.
 */
import { Toaster } from "sonner";
import ConfirmDialogHost from "./ConfirmDialog";

export default function FeedbackHost() {
    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className:
                        "!rounded-2xl !border !border-slate-200/60 !bg-white !text-slate-900 !shadow-xl dark:!border-white/10 dark:!bg-[#141d3a] dark:!text-slate-100",
                }}
            />
            <ConfirmDialogHost />
        </>
    );
}
