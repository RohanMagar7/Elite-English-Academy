"use client";

import Link from "next/link";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menu = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Gallery", href: "/gallery" },
        { name: "Notices", href: "/notices" },
        { name: "Admission", href: "/admission" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-blue-950/95 backdrop-blur-lg shadow-xl"
                    : "bg-blue-950"
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="rounded-xl bg-yellow-400 p-2 text-blue-950">
                        <GraduationCap size={24} />
                    </div>

                    <div>
                        <h1 className="text-lg font-extrabold tracking-wide text-yellow-400">
                            ELITE'S
                        </h1>
                        <p className="text-xs text-blue-200">
                            English Academy
                        </p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-7 md:flex">
                    {menu.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative text-sm font-medium transition ${pathname === item.href
                                    ? "text-yellow-400"
                                    : "text-white hover:text-yellow-300"
                                }`}
                        >
                            {item.name}

                            {pathname === item.href && (
                                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded bg-yellow-400"></span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <a
                        href="tel:+918888711228"
                        className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:bg-yellow-300"
                    >
                        <Phone size={16} />
                        Enquire Now
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="text-white md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`overflow-hidden bg-blue-900 transition-all duration-300 md:hidden ${open ? "max-h-96 py-3" : "max-h-0"
                    }`}
            >
                {menu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-6 py-3 text-sm transition ${pathname === item.href
                                ? "bg-yellow-400 text-blue-950 font-semibold"
                                : "text-white hover:bg-blue-800"
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}

                <div className="px-6 pt-3">
                    <a
                        href="tel:+918888711228"
                        className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 font-semibold text-blue-950"
                    >
                        <Phone size={18} />
                        Call for Admission
                    </a>
                </div>
            </div>
        </header>
    );
}