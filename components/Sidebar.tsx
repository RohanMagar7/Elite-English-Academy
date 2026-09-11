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
} from "lucide-react";

const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Notices", href: "/admin/notices", icon: Bell },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "Admissions", href: "/admin/admissions", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-72 flex-col justify-between bg-gradient-to-b from-[#071A49] to-[#102B70] text-white shadow-2xl">

            {/* Logo */}
            <div>
                <div className="border-b border-blue-800 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-yellow-400 p-3 text-blue-950">
                            <GraduationCap size={26} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-yellow-400">
                                Elite Admin
                            </h1>
                            <p className="text-xs text-blue-200">
                                English Academy Panel
                            </p>
                        </div>
                    </div>
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
                                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${active
                                        ? "bg-yellow-400 text-blue-950 font-semibold shadow-lg"
                                        : "text-blue-100 hover:bg-blue-800 hover:translate-x-1"
                                    }`}
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
                <div className="mb-4 rounded-xl bg-blue-900 p-3">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-blue-300">
                        admin@eliteacademy.com
                    </p>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-600">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}