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

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile top bar */}
            <div className="md:hidden bg-primary text-on-primary px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md">
                        <Menu />
                    </button>
                    <div className="text-lg font-bold">Elite Admin</div>
                </div>
            </div>

            <div className="flex">
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}