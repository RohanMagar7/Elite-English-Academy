/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { requireAdmin } from "@/lib/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Server-side auth check on every admin page load.
    // Redirects to /login if not authenticated or session expired.
    await requireAdmin();

    return <AdminShell>{children}</AdminShell>;
}