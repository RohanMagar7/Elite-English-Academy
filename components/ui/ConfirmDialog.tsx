"use client";

/**
 * Premium confirmation dialog — promise-based replacement for window.confirm.
 *
 * Usage (works anywhere, no hooks required):
 *   if (!(await confirmDialog({ message: "Delete this course?", tone: "danger" }))) return;
 *
 * `confirmDialog()` dispatches a DOM event consumed by <FeedbackHost />
 * mounted in the root layout, which renders an accessible, themed dialog.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, HelpCircle } from "lucide-react";

export type ConfirmOptions = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    tone?: "danger" | "primary";
};

type ConfirmRequest = ConfirmOptions & { resolve: (ok: boolean) => void };

const EVENT = "elite-confirm";

export function confirmDialog(opts: ConfirmOptions | string): Promise<boolean> {
    const options: ConfirmOptions = typeof opts === "string" ? { message: opts } : opts;
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent<ConfirmRequest>(EVENT, { detail: { ...options, resolve } })
        );
    });
}

export default function ConfirmDialogHost() {
    const [request, setRequest] = useState<ConfirmRequest | null>(null);
    const confirmRef = useRef<HTMLButtonElement>(null);
    const liveRef = useRef<ConfirmRequest | null>(null);

    useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<ConfirmRequest>).detail;
            liveRef.current?.resolve(false); // auto-dismiss any pending dialog
            liveRef.current = detail;
            setRequest(detail);
        };
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, []);

    const settle = useCallback((ok: boolean) => {
        liveRef.current?.resolve(ok);
        liveRef.current = null;
        setRequest(null);
    }, []);

    useEffect(() => {
        if (!request) return;
        confirmRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") settle(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [request, settle]);

    if (!request) return null;

    const danger = request.tone === "danger";

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={request.title || "Confirm action"}
        >
            <div
                className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
                onClick={() => settle(false)}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#101737] sm:p-8">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        danger
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : "bg-blue-50 text-brand-blue dark:bg-blue-400/10 dark:text-blue-300"
                    }`}
                >
                    {danger ? <AlertTriangle size={22} /> : <HelpCircle size={22} />}
                </div>

                <h2 className="mt-4 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                    {request.title || (danger ? "Are you sure?" : "Confirm")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {request.message}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => settle(false)}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        {request.cancelText || "Cancel"}
                    </button>
                    <button
                        type="button"
                        ref={confirmRef}
                        onClick={() => settle(true)}
                        className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98] ${
                            danger
                                ? "bg-red-600 shadow-red-600/25"
                                : "bg-brand-blue shadow-brand-blue/25"
                        }`}
                    >
                        {request.confirmText || (danger ? "Delete" : "Confirm")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
