/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect } from "react";

/** Admin section boundary — generic message, full error console-logged. */
export default function AdminError({
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
    <div className="admin-page">
      <h1 className="admin-page-title">Something went wrong</h1>
      <p className="text-slate-600">This section couldn&apos;t be loaded. Please try again.</p>
      <button onClick={reset} className="admin-btn-primary mt-4">
        Try again
      </button>
    </div>
  );
}
