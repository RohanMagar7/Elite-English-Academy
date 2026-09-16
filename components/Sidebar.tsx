"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Image,
    Bell,
    Star,
    Users,
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

    // container: fixed overlay on small screens when mobileOpen true, otherwise hidden; always visible on md+
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-[#071A49] to-[#102B70] text-white shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 md:w-72 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            aria-hidden={!mobileOpen}
        >

            <div className="flex h-full flex-col justify-between">
                {/* Logo */}
                <div>
                    <div className="border-b border-blue-800 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-yellow-400 p-3 text-blue-950">
                                <GraduationCap size={26} />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-yellow-400">Elite Admin</h1>
                                <p className="text-xs text-blue-200">English Academy Panel</p>
                            </div>
                        </div>

                        {/* Close button for mobile */}
                        <button onClick={onClose} className="md:hidden text-blue-100">
                            <X />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 p-4">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${active ? "bg-yellow-400 text-blue-950 font-semibold shadow-lg" : "text-blue-100 hover:bg-blue-800 hover:translate-x-1"}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer */}

                <div className="border-t border-blue-800 p-4">
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/login");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-600"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}