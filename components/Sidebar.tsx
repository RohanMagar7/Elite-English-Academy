/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
    LayoutDashboard,
    BookOpen,
    Image,
    Bell,
    Star,
    Users,
    Mail,
    Settings,
    GraduationCap,
    LogOut,
    X,
    Clock,
    CircleHelp,
    Trophy,
    UserCheck,
    Menu as MenuIcon,
    Images,
    BarChart3,
    Share2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Trainers", href: "/admin/trainers", icon: UserCheck },
    { name: "Batches", href: "/admin/batches", icon: Clock },
    { name: "Success Stories", href: "/admin/success-stories", icon: Trophy },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "FAQs", href: "/admin/faqs", icon: CircleHelp },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Notices", href: "/admin/notices", icon: Bell },
    { name: "Admissions", href: "/admin/admissions", icon: Users },
    { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
    { name: "Header & Menu", href: "/admin/navigation", icon: MenuIcon },
    { name: "Banners / Hero", href: "/admin/hero", icon: Images },
    { name: "Stats", href: "/admin/stats", icon: BarChart3 },
    { name: "Features", href: "/admin/features", icon: GraduationCap },
    { name: "Footer & Social", href: "/admin/footer", icon: Share2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const open = Boolean(mobileOpen);

    // Close the mobile drawer on Escape, and auto-close it once we reach desktop widths.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose?.();
        };
        const mq = window.matchMedia("(min-width: 768px)");
        const onMedia = (e: MediaQueryListEvent) => {
            if (e.matches) onClose?.();
        };
        window.addEventListener("keydown", onKey);
        if (mq.matches) onClose?.();
        mq.addEventListener("change", onMedia);
        return () => {
            window.removeEventListener("keydown", onKey);
            mq.removeEventListener("change", onMedia);
        };
    }, [open, onClose]);

    const isActive = (href: string) =>
        href === "/admin" ? pathname === href : pathname === href || pathname?.startsWith(href + "/");

    // container: fixed overlay drawer on small screens when open, otherwise hidden; sticky column on md+
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col overflow-hidden bg-gradient-to-b from-[#071A49] to-[#102B70] text-white shadow-2xl transition-transform duration-300 ease-out sm:w-64 md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            aria-label="Admin navigation"
        >

            <div className="flex h-full min-h-0 flex-col">
                {/* Logo */}
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 p-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-yellow-400 p-2.5 text-blue-950">
                            <GraduationCap size={24} />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-yellow-400">Elite Admin</h1>
                            <p className="text-xs text-blue-200">English Academy Panel</p>
                        </div>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-blue-100 transition hover:bg-white/10 md:hidden"
                        aria-label="Close admin menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain p-4" aria-label="Admin sections">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                aria-current={active ? "page" : undefined}
                                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 sm:text-[15px] ${active ? "bg-yellow-400 font-semibold text-blue-950 shadow-lg" : "text-blue-100 hover:bg-white/10 hover:text-white active:scale-[0.99]"}`}
                            >
                                <Icon size={20} className="shrink-0" aria-hidden="true" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}

                <div className="shrink-0 border-t border-white/10 p-4">
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/login");
                        }}
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.99]"
                    >
                        <LogOut size={18} aria-hidden="true" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}