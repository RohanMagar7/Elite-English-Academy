import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkAuthRateLimit, getClientIp, applyRateLimitHeaders, rateLimitedResponse } from "@/lib/rate-limit";
import { signupSchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForAuthError, safeErrorResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = signupSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid signup data.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const { email, password } = parsed.data;
    // Signup shares the strict auth tier (per-IP + per-account backoff).
    const decision = checkAuthRateLimit(ip, `signup:${email}`);
    if (!decision.allowed) return rateLimitedResponse(decision, "Too many signup attempts. Please try again later.");
    const res = NextResponse.next();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { cookies: { getAll: () => req.cookies.getAll(), setAll: (cs) => cs.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) } });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      // Full error logged server-side; user gets a safe generic message.
      logServerError("POST /api/auth/signup", error);
      const errRes = NextResponse.json({ error: publicMessageForAuthError(error) }, { status: 400 });
      applyRateLimitHeaders(errRes, decision);
      return errRes;
    }
    const okRes = NextResponse.json({ ok: true, user: { id: data.user?.id, email: data.user?.email } });
    res.cookies.getAll().forEach((c) => okRes.cookies.set(c.name, c.value, c as never));
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/auth/signup", err, 500, "Unable to sign up right now. Please try again.");
  }
}
