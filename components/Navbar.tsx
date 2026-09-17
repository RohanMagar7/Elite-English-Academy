"use client";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
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
        "sticky top-0 z-50 w-full transition-all duration-300 " +
        (scrolled
          ? "border-b-2 border-dashed border-pencil bg-paper/90 py-3 backdrop-blur-sm"
          : "bg-transparent py-5")
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-4"
          aria-label="Home"
        >
            <img
              src={logoUrl}
              alt="Logo"
              className="h-12 w-12 shrink-0 border-2 border-pencil bg-white object-contain p-1 shadow-[3px_3px_0px_0px_#2d2d2d] transition-transform duration-100 group-hover:-rotate-6"
              style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}
            />

          <div className="min-w-0">
            <div className={`truncate font-display text-lg font-bold sm:text-xl transition-colors text-pencil`}>
              {settings.academy_name}
            </div>
            <p className={`truncate text-xs font-bold uppercase tracking-widest text-marker`}>
              {settings.tagline}
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex lg:shrink-0">
          {menu.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                className={
                  "whitespace-nowrap px-3 py-1.5 font-bold transition-transform duration-100 xl:px-4 " +
                  (active
                    ? "bg-postit -rotate-1 border-2 border-pencil shadow-[2px_2px_0px_0px_#2d2d2d]"
                    : "text-pencil/70 hover:text-pencil hover:underline hover:decoration-wavy hover:decoration-ballpoint hover:underline-offset-4 hover:-rotate-1")
                }
                style={{ borderRadius: active ? "15px 155px 15px 155px / 155px 15px 155px 15px" : undefined }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href={settings.phone_href || "tel:+918888711228"}
            className="btn-primary !h-11 whitespace-nowrap px-4 text-sm xl:px-6"
          >
            <Phone size={16} strokeWidth={2.5} className="mr-2" />
            Enquire Now
          </a>
        </div>

        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
          className="shrink-0 border-2 border-pencil bg-white p-2.5 text-pencil shadow-[3px_3px_0px_0px_#2d2d2d] transition-transform duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#2d2d2d] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none lg:hidden"
          style={{ borderRadius: "45% 55% 48% 52% / 52% 46% 54% 48%" }}
        >
          {open ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      </nav>

      <div
        className={
          "absolute left-0 top-full w-full bg-paper transition-all duration-300 lg:hidden " +
          (open ? "max-h-[80vh] overflow-y-auto border-b-2 border-dashed border-pencil" : "max-h-0 overflow-hidden")
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
                  "block px-5 py-4 font-bold transition-transform duration-100 " +
                  (active
                    ? "border-2 border-pencil bg-postit -rotate-1 shadow-[3px_3px_0px_0px_#2d2d2d]"
                    : "text-pencil/70 hover:bg-white hover:-rotate-1")
                }
                style={{ borderRadius: "125px 10px 155px 10px / 10px 155px 10px 125px" }}
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

