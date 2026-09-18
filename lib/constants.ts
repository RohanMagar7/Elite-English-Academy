/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

/** Single source of truth for app-wide constants. */

export const NAV_FALLBACK = [
{ label: "Home", href: "/" },
{ label: "About", href: "/about" },
{ label: "Courses", href: "/courses" },
{ label: "Gallery", href: "/gallery" },
{ label: "Admission", href: "/admission" },
{ label: "Contact", href: "/contact" },
] as const;

export const FOOTER_QUICK_LINKS_FALLBACK = [
{ label: "About Us", href: "/about" },
{ label: "Courses", href: "/courses" },
{ label: "Gallery", href: "/gallery" },
{ label: "Admission", href: "/admission" },
{ label: "Contact", href: "/contact" },
] as const;

export const FOOTER_COURSE_LINKS_FALLBACK = [
{ label: "Spoken English", href: "/courses" },
{ label: "IELTS Preparation", href: "/courses" },
] as const;

/** Page size used by admin tables and public lists. */
export const PAGE_SIZE = 10;
