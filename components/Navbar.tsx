"use client";

import Link from "next/link";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { academy } from "@/lib/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Gallery", href: "/gallery" },
    // { name: "Notices", href: "/notices" },
    { name: "Admission", href: "/admission" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-blue-900/95 backdrop-blur-xl shadow-lg border-b border-blue-800"
          : "bg-blue-900"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/vercel.png"
          className="flex items-center gap-3 min-w-0"
          aria-label="Elite English Academy Home"
        >
          <div className="shrink-0 rounded-xl bg-yellow-400 p-2 text-blue-950 shadow-md">
            <GraduationCap size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm sm:text-base lg:text-lg font-extrabold tracking-wide text-yellow-400">
              {academy.name}
            </h1>

            <p className="truncate text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-blue-200">
              {academy.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-colors duration-300 ${
                  active
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-2 h-0.5 rounded-full bg-yellow-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <a
            href={academy.phoneHref}
            className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-blue-950 shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-300"
          >
            <Phone size={16} />
            Enquire Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white transition hover:bg-blue-800 lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-blue-950 transition-all duration-300 lg:hidden ${
          open
            ? "max-h-[600px] border-t border-blue-800"
            : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                  active
                    ? "bg-yellow-400 text-blue-950"
                    : "text-white hover:bg-blue-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <a
            href={academy.phoneHref}
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-base font-semibold text-blue-950 shadow-md transition hover:bg-yellow-300"
          >
            <Phone size={18} />
            Call for Admission
          </a>

          <a
            href={`https://wa.me/918888711228?text=Hello%20Elite%20English%20Academy,%20I%20want%20to%20know%20more%20about%20your%20courses.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center rounded-xl border border-green-500 py-3 text-base font-semibold text-green-400 transition hover:bg-green-500 hover:text-white"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  );
}