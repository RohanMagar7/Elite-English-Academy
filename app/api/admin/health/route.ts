/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { requireAdminApi } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { rateLimitHeaders } from "@/lib/rate-limit";

export async function GET() {
    const { user, response, rateLimit } = await requireAdminApi();

    if (response) {
        return response;
    }

    return NextResponse.json({
        ok: true,
        message: "Admin API is secure and working.",
        user: {
            id: user!.id,
            email: user!.email,
        },
    }, rateLimit ? { headers: rateLimitHeaders(rateLimit) } : undefined);
}