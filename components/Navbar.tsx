"use client";
import Link from "next/link";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";
type NavLink = { id?: string; label: string; href: string };
const FALLBACK_MENU: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Gallery", href: "/gallery" },
  { label: "Admission", href: "/admission" },
  { label: "Contact", href: "/contact" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<NavLink[]>(FALLBACK_MENU);
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("navigation_links")
        .select("id, label, href")
        .eq("is_active", true)
        .order("sort_order");
      if (data && data.length > 0) setMenu(data);
    })();
  }, []);
  const logoUrl = settings.logo_url || "/vercel.png";
  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-all duration-300 " +
        (scrolled
          ? "bg-blue-900/95 backdrop-blur-xl shadow-lg border-b border-blue-800"
          : "bg-blue-900")
      }
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 min-w-0"
          aria-label="Home"
        >

          <img
            src={logoUrl}
            alt="Logo"
            className="h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-1 shadow-md"
          />

          <div className="min-w-0">
            <div className="truncate text-sm sm:text-base lg:text-lg font-extrabold tracking-wide text-yellow-400">
              {settings.academy_name}
            </div>
            <p className="truncate text-xs sm:text-sm tracking-wide text-blue-200">
              {settings.tagline}
            </p>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                className={
                  "relative text-sm font-medium transition-colors " +
                  (active
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-400")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden lg:block">
          <a
            href={settings.phone_href || "tel:+918888711228"}
            className="header-cta"
          >
            <Phone size={16} />
            Enquire Now
          </a>
        </div>
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white hover:bg-blue-800 lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      <div
        className={
          "overflow-hidden bg-blue-950 transition-all lg:hidden " +
          (open ? "max-h-[600px] border-t border-blue-800" : "max-h-0")
        }
      >
        <div className="space-y-1 px-4 py-4">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  "block rounded-xl px-4 py-3 text-base font-medium " +
                  (active
                    ? "bg-yellow-400 text-blue-950"
                    : "text-white hover:bg-blue-800")
                }
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={settings.phone_href || "tel:+918888711228"}
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-blue-500 py-3 font-semibold text-blue-700 hover:bg-blue-700 hover:text-white"
          >
            <Phone size={18} />
            Call for Admission
          </a>
        </div>
      </div>
    </header>
  );
}
