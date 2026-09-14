import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

/**
 * Returns the currently authenticated user, or null if not logged in.
 * Verifies the session with Supabase (validates the JWT server-side).
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Server-side guard for admin pages.
 * If the user is not logged in, redirects to /login.
 * If the session is invalid/expired, signs out and redirects to /login.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Session is invalid or expired — sign out to clear stale cookies
    await supabase.auth.signOut();
    redirect("/login");
  }

  return { user, supabase };
}