"use client";

/**
 * Premium notification helpers (sonner wrapper).
 * Drop-in replacement for window.alert with themed success / error /
 * warning / info toasts. Returns void so `return alert(...)` call sites
 * must be rewritten as `{ notify.error(...); return; }`.
 */
import { toast } from "sonner";

const base = {
    success: (message: string, description?: string) =>
        toast.success(message, { description }),
    error: (message: string, description?: string) =>
        toast.error(message, { description }),
    warning: (message: string, description?: string) =>
        toast.warning(message, { description }),
    info: (message: string, description?: string) =>
        toast.info(message, { description }),
};

export const notify = {
    ...base,
    /** For load/save/delete jobs: auto success/error toasts from a promise. */
    promise: <T,>(
        job: Promise<T>,
        messages: { loading: string; success: string; error: string }
    ) => toast.promise(job, messages),
};

export default notify;
