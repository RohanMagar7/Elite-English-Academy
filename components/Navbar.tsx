/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useScrolled } from "@/hooks/useScrolled";
import { useBodyScrollLock } from "@/hooks/useDisclosure";
import { NAV_FALLBACK } from "@/lib/constants";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [menu, setMenu] = useState<NavLink[]>([...NAV_FALLBACK]);
	const scrolled = useScrolled(40);
	const pathname = usePathname();
	const { settings } = useSiteSettings();

	useBodyScrollLock(open);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			const { data } = await supabase
				.from("navigation_links")
				.select("label, href")
				.eq("is_active", true)
				.order("sort_order");
			if (!cancelled && data && data.length > 0) setMenu(data);
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const logoUrl = settings.logo_url || "/vercel.png";

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all duration-300",
				scrolled
					? "border-b border-blue-800 bg-blue-900/95 shadow-lg backdrop-blur-xl"
					: "bg-blue-900",
			)}
		>
			<nav
				aria-label="Main navigation"
				className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
			>
				<Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Home">
					<img
						src={logoUrl}
						alt={`${settings.academy_name} logo`}
						className="h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-1 shadow-md"
					/>
					<div className="min-w-0">
						<div className="truncate text-sm font-extrabold tracking-wide text-gold-400 sm:text-base lg:text-lg">
							{settings.academy_name}
						</div>
						<p className="truncate text-xs tracking-wide text-blue-200 sm:text-sm">
							{settings.tagline}
						</p>
					</div>
				</Link>

				<div className="hidden items-center gap-5 lg:flex xl:gap-7">
					{menu.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.label + item.href}
								href={item.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"relative text-sm font-medium transition-colors",
									active ? "text-gold-400" : "text-white hover:text-gold-400",
								)}
							>
								{item.label}
							</Link>
						);
					})}
				</div>

				<div className="hidden lg:block">
					<a href={settings.phone_href || "tel:+918888711228"} className="header-cta">
						<Phone size={16} aria-hidden />
						Enquire Now
					</a>
				</div>

				<button
					type="button"
					aria-label={open ? "Close navigation menu" : "Open navigation menu"}
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
					className="rounded-lg p-2 text-white hover:bg-blue-800 lg:hidden"
				>
					{open ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
				</button>
			</nav>

			<div
				className={cn(
					"overflow-hidden bg-blue-950 transition-all lg:hidden",
					open ? "max-h-[600px] border-t border-blue-800" : "max-h-0",
				)}
			>
				<div className="space-y-1 px-4 py-4">
					{menu.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.label + item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								aria-current={active ? "page" : undefined}
								className={cn(
									"block rounded-xl px-4 py-3 text-base font-medium",
									active
										? "bg-gold-400 text-blue-950"
										: "text-white hover:bg-blue-800",
								)}
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
						<Phone size={18} aria-hidden />
						Call for Admission
					</a>
				</div>
			</div>
		</header>
	);
}
