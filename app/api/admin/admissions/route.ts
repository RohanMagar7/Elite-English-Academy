import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/api-auth";
import { idSchema, statusSchema, toIssues } from "@/lib/validation";
import { logServerError, publicMessageForSupabaseError, safeErrorResponse } from "@/lib/errors";

/**
 * Admin admissions moderation — strict schema validation on every input.
 * Client-side direct Supabase writes cannot be trusted; this route is the
 * boundary: UUID id + strict status enum, reject anything else.
 */
export async function PATCH(req: NextRequest) {
  try {
    const { supabase, response } = await requireAdminApi();
    if (response) return response;
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const parsed = z.strictObject({ id: idSchema, status: statusSchema }).safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const { error } = await supabase.from("admissions").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) { logServerError("PATCH /api/admin/admissions", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Update failed. Please try again.") }, { status: 500 }); }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return safeErrorResponse("PATCH /api/admin/admissions", err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { supabase, response } = await requireAdminApi();
    if (response) return response;
    const id = new URL(req.url).searchParams.get("id") ?? "";
    // STRICT: UUID format required — anything else is rejected, not coerced.
    const parsed = idSchema.safeParse(id);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid id.", issues: toIssues(parsed.error) }, { status: 400 });
    }
    const { error } = await supabase.from("admissions").delete().eq("id", parsed.data);
    if (error) { logServerError("DELETE /api/admin/admissions", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Delete failed. Please try again.") }, { status: 500 }); }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return safeErrorResponse("DELETE /api/admin/admissions", err);
  }
}
