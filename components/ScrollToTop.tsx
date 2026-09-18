"use client";

import { ArrowUp } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";

export default function ScrollToTop() {
  const visible = useScrolled(400);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-700 md:bottom-6 md:right-24 md:h-12 md:w-12"
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
