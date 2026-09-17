import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import {
  checkAuthenticatedRateLimit,
  checkPublicRateLimit,
  getClientIp,
  applyRateLimitHeaders,
} from "@/lib/rate-limit";

function limited(message: string, retryAfter: number) {
  const res = NextResponse.json({ error: message }, { status: 429 });
  res.headers.set("Retry-After", String(retryAfter));
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  const isLoginPage = pathname === "/login";
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Moderate limits on public API endpoints (non-admin /api/*, excluding
  // /api/auth/* which enforces its own strict per-IP + per-account tier).
  if (pathname.startsWith("/api/") && !isAdminApi && !isAuthApi) {
    const d = checkPublicRateLimit(ip);
    if (!d.allowed) return limited("Too many requests. Please slow down.", d.retryAfter);
  }

  // Allow login page and auth APIs through — /api/auth/* route handlers
  // enforce the strict auth tier (per-IP + per-account backoff) where the
  // account identifier is known. Enforcing here too would double-count.
  if (isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verify logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → redirect to admin login
  if (!user) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Loose per-user limit on authenticated admin traffic.
  const d = checkAuthenticatedRateLimit(user.id, true);
  if (!d.allowed) {
    if (isAdminApi) return limited("Too many requests. Please slow down.", d.retryAfter);
    applyRateLimitHeaders(response, d);
    response.headers.set("Retry-After", String(d.retryAfter));
    return response;
  }
  applyRateLimitHeaders(response, d);

  return response;
}

export const config = {
  matcher: ["/login", "/api/auth/:path*", "/admin/:path*", "/api/:path*"],
};