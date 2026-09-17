import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkPublicRateLimit, getClientIp, applyRateLimitHeaders, rateLimitedResponse } from "@/lib/rate-limit";
import { testimonialSubmitSchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForSupabaseError, safeErrorResponse } from "@/lib/errors";

/** Public testimonial submission — strict schema validation + moderate rate limit. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = testimonialSubmitSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review data.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const decision = checkPublicRateLimit(ip);
    if (!decision.allowed) return rateLimitedResponse(decision, "Too many requests. Please slow down.");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("testimonials").insert([{ ...parsed.data, is_active: true }]);
    if (error) {
      logServerError("POST /api/testimonials", error);
      const errRes = NextResponse.json({ error: publicMessageForSupabaseError(error, "Unable to submit your review right now.") }, { status: 500 });
      applyRateLimitHeaders(errRes, decision);
      return errRes;
    }
    const okRes = NextResponse.json({ ok: true }, { status: 201 });
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/testimonials", err, 500, "Unable to submit your review right now.");
  }
}

