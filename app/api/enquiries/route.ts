import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkPublicRateLimit, getClientIp, applyRateLimitHeaders, rateLimitedResponse } from "@/lib/rate-limit";
import { enquirySchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForSupabaseError, safeErrorResponse } from "@/lib/errors";

/** Public contact enquiry — strict schema validation + moderate rate limit. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid enquiry data.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const decision = checkPublicRateLimit(ip);
    if (!decision.allowed) return rateLimitedResponse(decision, "Too many requests. Please slow down.");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("enquiries").insert([{ ...parsed.data, status: "New" }]);
    if (error) {
      // Raw DB error logged server-side; generic message to the user.
      logServerError("POST /api/enquiries", error);
      const errRes = NextResponse.json({ error: publicMessageForSupabaseError(error, "Unable to send your message right now. Please try again.") }, { status: 500 });
      applyRateLimitHeaders(errRes, decision);
      return errRes;
    }
    const okRes = NextResponse.json({ ok: true }, { status: 201 });
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/enquiries", err, 500, "Unable to send your message right now. Please try again.");
  }
}

