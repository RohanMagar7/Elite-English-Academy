/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Listen for auth state changes (e.g. session expiry, sign-out)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
                // Session expired or user signed out — send to login
                router.push("/login");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    // Lock body scroll when the mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 border-b border-blue-900/20 bg-blue-950 text-white md:hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-2 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-yellow-400"
                            aria-label="Open admin menu"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="text-base font-bold tracking-tight">Elite Admin</div>
                    </div>
                    <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-[11px] font-bold text-blue-950">
                        ADMIN
                    </span>
                </div>
            </header>

            <div className="flex min-h-screen md:min-h-0">
                {/* Backdrop for mobile drawer */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-blue-950/60 backdrop-blur-[1px] md:hidden"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

                <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    <div className="mx-auto w-full max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}