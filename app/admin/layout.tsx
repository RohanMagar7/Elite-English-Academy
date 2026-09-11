"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    router.push("/login");
                }
            } catch (err) {
                router.push("/login");
            } finally {
                setChecking(false);
            }
        }

        checkAuth();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Checking authentication...</div>
            </div>
        );
    }

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