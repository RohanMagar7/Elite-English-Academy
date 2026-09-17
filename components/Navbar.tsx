"use client";
import Link from "next/link";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ThemeToggle from "@/components/theme/ThemeToggle";
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
  // Close the mobile menu when the viewport grows to desktop size,
  // so the scroll lock doesn't stick after rotating/resizing.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const logoUrl = settings.logo_url || "/vercel.png";
  const showImg = !!logoUrl && logoUrl !== "/vercel.png";
  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-all duration-500 " +
        (scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-brand-blue/5 border-b border-slate-100 py-3 dark:bg-[#0c1230]/80 dark:border-white/10"
          : "bg-transparent py-5")
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2.5 sm:gap-4 group"
          aria-label="Home"
        >
            <img
              src={logoUrl}
              alt="Logo"
              className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-xl transition-transform group-hover:scale-110"
            />
        
          <div className="min-w-0">
            <div className={`truncate text-lg sm:text-xl font-display font-black tracking-tighter transition-colors ${scrolled ? 'text-brand-blue' : 'text-brand-blue'}`}>
              {settings.academy_name}
            </div>
            <p className={`truncate text-xs font-bold uppercase tracking-widest transition-colors ${scrolled ? 'text-brand-gold' : 'text-brand-gold'}`}>
              {settings.tagline}
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex shrink-0 items-center gap-0.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 dark:bg-white/5 dark:border-white/10">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                className={
                  "whitespace-nowrap px-3 py-2 text-sm font-bold rounded-xl transition-all xl:px-5 " +
                  (active
                    ? "bg-white text-brand-blue shadow-sm dark:bg-white/10 dark:text-blue-200"
                    : "text-slate-600 hover:text-brand-blue hover:bg-white/50 dark:text-slate-300 dark:hover:text-blue-200 dark:hover:bg-white/5")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex shrink-0 items-center gap-4">
          {/* <ThemeToggle /> */}
          <a
            href={settings.phone_href || "tel:+918888711228"}
            className="btn-primary !h-11 whitespace-nowrap px-4 text-sm xl:px-6"
          >
            <Phone size={16} className="mr-2" />
            Enquire Now
          </a>
        </div>

        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
          className={`shrink-0 rounded-2xl p-2.5 transition-colors lg:hidden ${scrolled ? 'bg-slate-100 text-brand-blue dark:bg-white/10 dark:text-slate-100' : 'bg-brand-blue text-white'}`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className={
          "absolute top-full left-0 w-full overflow-hidden bg-white/95 backdrop-blur-2xl transition-all duration-500 lg:hidden dark:bg-[#0c1230]/95 " +
          (open ? "max-h-[80vh] overflow-y-auto border-b border-slate-200 shadow-2xl dark:border-white/10" : "max-h-0")
        }
      >
        <div className="space-y-2 px-4 py-6">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  "block rounded-2xl px-5 py-4 text-base font-bold transition-all " +
                  (active
                    ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/20"
                    : "text-slate-600 hover:bg-slate-50")
                }
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4">
            <a
              href={settings.phone_href || "tel:+918888711228"}
              onClick={() => setOpen(false)}
              className="btn-gold w-full"
            >
              <Phone size={18} className="mr-2" />
              Call for Admission
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

