import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkAuthRateLimit, recordAuthFailure, getClientIp, applyRateLimitHeaders, rateLimitedResponse } from "@/lib/rate-limit";
import { resetPasswordSchema, toIssues } from "@/lib/validation";
import { logServerError, safeErrorResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = resetPasswordSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const { email } = parsed.data;
    // Password-reset shares the strict auth tier; never reveal account existence.
    const decision = checkAuthRateLimit(ip, `reset:${email}`);
    if (!decision.allowed) return rateLimitedResponse(decision, "Too many password-reset attempts. Please try again later.");
    const res = NextResponse.next();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { cookies: { getAll: () => req.cookies.getAll(), setAll: (cs) => cs.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) } });
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    // Log failures server-side only — response stays generic either way.
    if (error) { logServerError("POST /api/auth/reset-password", error); recordAuthFailure(`reset:${email}`); }
    // Always return generic success to prevent account enumeration.
    const okRes = NextResponse.json({ ok: true, message: "If an account exists for this email, a reset link has been sent." });
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/auth/reset-password", err, 500, "Unable to process your request right now. Please try again.");
  }
}
