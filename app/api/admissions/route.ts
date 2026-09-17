import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkPublicRateLimit, getClientIp, applyRateLimitHeaders, rateLimitedResponse } from "@/lib/rate-limit";
import { admissionSchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForSupabaseError, safeErrorResponse } from "@/lib/errors";

/** Public admission enquiry — strict schema validation + moderate rate limit. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT: reject anything that doesn't match type/length/format.
    const parsed = admissionSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid admission data.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const decision = checkPublicRateLimit(ip);
    if (!decision.allowed) return rateLimitedResponse(decision, "Too many requests. Please slow down.");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("admissions").insert([parsed.data]);
    if (error) {
      logServerError("POST /api/admissions", error);
      const errRes = NextResponse.json({ error: publicMessageForSupabaseError(error, "Unable to submit right now. Please try again.") }, { status: 500 });
      applyRateLimitHeaders(errRes, decision);
      return errRes;
    }
    const okRes = NextResponse.json({ ok: true }, { status: 201 });
    applyRateLimitHeaders(okRes, decision);
    return okRes;
  } catch (err) {
    return safeErrorResponse("POST /api/admissions", err, 500, "Unable to submit right now. Please try again.");
  }
}

