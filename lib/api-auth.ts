import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

/**
 * Guard for admin API routes.
 * Returns the authenticated user + supabase client on success,
 * or a 401 JSON response if the user is not logged in / session expired.
 */
export async function requireAdminApi() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Session invalid or expired — sign out to clear stale cookies
    await supabase.auth.signOut();

    return {
      user: null,
      supabase,
      response: NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      ),
    };
  }

  return { user, supabase, response: null };
}