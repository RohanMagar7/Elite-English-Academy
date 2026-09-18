/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkAuthenticatedRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

/**
 * Guard for admin API routes.
 * Enforces the loose per-user `authenticated` tier, then verifies session.
 * Returns the authenticated user + supabase client on success,
 * or a 401/429 JSON response if the user is not logged in / rate limited.
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

  // Loose authenticated-user limit (per user id).
  const decision = checkAuthenticatedRateLimit(user.id, true);
  if (!decision.allowed) {
    return {
      user: null,
      supabase,
      response: NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: rateLimitHeaders(decision) }
      ),
    };
  }

  return { user, supabase, response: null, rateLimit: decision };
}