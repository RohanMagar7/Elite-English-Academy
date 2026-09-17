"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary: catches render/data errors in this segment.
 * Shows a generic message (never stack traces or paths); full error is
 * logged for debugging.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold text-blue-950">Something went wrong.</h2>
      <p className="text-slate-600">Please try again. If the problem continues, contact us directly.</p>
      <button
        onClick={reset}
        className="rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
