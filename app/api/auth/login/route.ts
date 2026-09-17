import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  checkAuthRateLimit,
  recordAuthFailure,
  clearAuthFailures,
  getClientIp,
  applyRateLimitHeaders,
  rateLimitedResponse,
} from "@/lib/rate-limit";
import { loginSchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForAuthError, safeErrorResponse } from "@/lib/errors";

function serverClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials format.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const { email, password } = parsed.data;

    // Strict auth check: per-IP + per-account exponential backoff.
    const decision = checkAuthRateLimit(ip, email);
    if (!decision.allowed) {
      const msg =
        decision.scope === "account"
          ? `Too many failed attempts for this account. Try again in ${decision.retryAfter}s.`
          : "Too many login attempts. Please try again later.";
      return rateLimitedResponse(decision, msg);
    }

    const res = NextResponse.next();
    const supabase = serverClient(req, res);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Full auth error logged server-side; user gets a generic message.
      logServerError("POST /api/auth/login", error);
      const { backoffSeconds } = recordAuthFailure(email);
      const errRes = NextResponse.json({ error: publicMessageForAuthError(error) }, { status: 401 });
      applyRateLimitHeaders(errRes, decision);
      if (backoffSeconds > 0) errRes.headers.set("X-Auth-Backoff", String(backoffSeconds));
      return errRes;
    }

    clearAuthFailures(email);
    const okRes = NextResponse.json({ ok: true, user: { id: data.user?.id, email: data.user?.email } });
    // Propagate refreshed auth cookies set during sign-in.
    res.cookies.getAll().forEach((c) => okRes.cookies.set(c.name, c.value, c as never));
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/auth/login", err, 500, "Unable to sign in right now. Please try again.");
  }
}
