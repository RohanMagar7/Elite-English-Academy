/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/api-auth";
import { idSchema, toIssues, shortText, longText, sortOrderSchema, flagSchema } from "@/lib/validation";
import { logServerError, publicMessageForSupabaseError, safeErrorResponse } from "@/lib/errors";

/**
 * Generic admin content boundary: every mutation is authenticated
 * (requireAdminApi: session + loose per-user rate limit) AND strictly
 * validated against a per-table zod schema (type + length + format).
 * Unknown tables / fields are rejected — never sanitized-and-accepted.
 */
const tableSchemas = {
  batches: z.strictObject({
    name: shortText(2, 100), time: shortText(1, 50),
    days: z.string().trim().max(100).default(""),
    level: z.string().trim().max(100).default(""),
    mode: z.enum(["Offline", "Online", "Hybrid"]).default("Offline"),
    description: z.string().trim().max(1000).default(""),
    sort_order: sortOrderSchema, is_active: flagSchema,
  }),
  notices: z.strictObject({
    title: shortText(3, 200),
    description: z.string().trim().max(5000).default(""),
    category: z.enum(["General", "Admission", "Exam", "Event", "Holiday"]).default("General"),
  }),
  faqs: z.strictObject({
    question: shortText(5, 500), answer: longText(2, 5000),
    sort_order: sortOrderSchema, is_active: flagSchema,
  }),
} as const;

type Table = keyof typeof tableSchemas;

const bodySchema = z.discriminatedUnion("op", [
  z.strictObject({ op: z.literal("create"), table: z.enum(["batches", "notices", "faqs"] as const), data: z.record(z.string(), z.unknown()) }),
  z.strictObject({ op: z.literal("update"), table: z.enum(["batches", "notices", "faqs"] as const), id: idSchema, data: z.record(z.string(), z.unknown()) }),
  z.strictObject({ op: z.literal("delete"), table: z.enum(["batches", "notices", "faqs"] as const), id: idSchema }),
  z.strictObject({ op: z.literal("toggle"), table: z.enum(["batches", "notices", "faqs"] as const), id: idSchema, is_active: z.boolean() }),
]);

export async function POST(req: NextRequest) {
  try {
    const { supabase, response } = await requireAdminApi();
    if (response) return response;
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    // STRICT outer validation: unknown op/table/fields rejected here.
    const outer = bodySchema.safeParse(raw);
    if (!outer.success) {
      return NextResponse.json({ error: "Invalid request.", issues: toIssues(outer.error) }, { status: 400 });
    }
    const body = outer.data as { op: string; table: Table; id?: string; data?: Record<string, unknown>; is_active?: boolean };
    if (body.op === "delete") {
      const { error } = await supabase.from(body.table).delete().eq("id", body.id!);
      if (error) { logServerError("POST /api/admin/content delete", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Delete failed. Please try again.") }, { status: 500 }); }
      return NextResponse.json({ ok: true });
    }
    if (body.op === "toggle") {
      if (typeof body.is_active !== "boolean") return NextResponse.json({ error: "Invalid is_active." }, { status: 400 });
      const { error } = await supabase.from(body.table).update({ is_active: !body.is_active }).eq("id", body.id!);
      if (error) { logServerError("POST /api/admin/content toggle", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Update failed. Please try again.") }, { status: 500 }); }
      return NextResponse.json({ ok: true });
    }
    // STRICT inner validation: payload must match the table schema exactly.
    const schema = tableSchemas[body.table];
    const inner = (schema as z.ZodTypeAny).safeParse(body.data ?? {});
    if (!inner.success) {
      return NextResponse.json({ error: "Invalid data.", issues: toIssues(inner.error) }, { status: 400 });
    }
    const data = inner.data as Record<string, unknown>;
    if (body.op === "create") {
      const { error } = await supabase.from(body.table).insert([data]);
      if (error) { logServerError("POST /api/admin/content create", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Create failed. Please try again.") }, { status: 500 }); }
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    const { error } = await supabase.from(body.table).update(data).eq("id", body.id!);
    if (error) { logServerError("POST /api/admin/content update", error); return NextResponse.json({ error: publicMessageForSupabaseError(error, "Update failed. Please try again.") }, { status: 500 }); }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return safeErrorResponse("POST /api/admin/content", err);
  }
}
