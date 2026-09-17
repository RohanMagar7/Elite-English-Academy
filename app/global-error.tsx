"use client";

/**
 * Global error boundary (root layout). Generic message only — no stack
 * traces, digests, or file paths reach the user.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Something went wrong.</h2>
        <p>Please reload the page and try again.</p>
        <button
          onClick={reset}
          className="rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
