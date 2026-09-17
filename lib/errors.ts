/**
 * Central error-handling contract.
 *
 * Rule: users NEVER see stack traces, internal file paths, or raw
 * database/auth errors. API routes return curated generic messages;
 * full details (message, code, stack, route, user) are logged server-side
 * via console.error for debugging.
 */

export const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export interface LogContext {
  route?: string;
  userId?: string;
  code?: string;
  details?: unknown;
}

/** Server-side only: log full error details, never sent to the client. */
export function logServerError(where: string, err: unknown, ctx?: LogContext): void {
  const payload = {
    where,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    code:
      ctx?.code ??
      (typeof err === "object" && err !== null && "code" in err
        ? String((err as Record<string, unknown>).code)
        : undefined),
    details: ctx?.details,
    route: ctx?.route,
    userId: ctx?.userId,
    at: new Date().toISOString(),
  };
  // Structured server log for debugging (never exposed to clients).
  console.error(JSON.stringify(payload));
}

/**
 * Map a Supabase/Postgres/auth error to a SAFE public message.
 * Known-benign cases (validation-style) keep a friendly message;
 * everything else collapses to a generic message.
 */
export function publicMessageForSupabaseError(
  err: { message?: string; code?: string } | null | undefined,
  fallback = GENERIC_MESSAGE,
): string {
  const code = err?.code ?? "";
  const msg = (err?.message ?? "").toLowerCase();
  // Unique violation — don't leak constraint/table names.
  if (code === "23505" || msg.includes("already exists") || msg.includes("duplicate")) {
    return "This record already exists.";
  }
  // Foreign key / not-null / check violations — don't leak schema.
  if (code.startsWith("23") || code.startsWith("22")) {
    return "Invalid data. Please check your input and try again.";
  }
  // RLS denial — don't leak policy/table names.
  if (code === "42501" || msg.includes("row-level security") || msg.includes("permission denied")) {
    return "You don't have permission to perform this action.";
  }
  return fallback;
}

/** Map Supabase Auth errors to safe public messages (no internals). */
export function publicMessageForAuthError(
  err: { message?: string; code?: string } | null | undefined,
): string {
  const msg = (err?.message ?? "").toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid") && msg.includes("credential")) {
    return "Invalid email or password.";
  }
  if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
    return "Please verify your email before signing in.";
  }
  if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("duplicate")) {
    return "An account with this email already exists.";
  }
  if (msg.includes("weak") || msg.includes("short")) {
    return "Password does not meet the requirements.";
  }
  return "Authentication failed. Please try again.";
}

function sanitizeDetail(value: unknown): unknown {
  if (typeof value === "string") {
    // Strip anything resembling a filesystem path or stack frame.
    return value
      .replace(/\/[^\s:]*\.(ts|tsx|js|jsx|mjs)(:\d+)*:?/g, "[file]")
      .replace(/[A-Za-z]:\\[^\s]*/g, "[file]")
      .replace(/\n\s*at\s+.*/g, "");
  }
  return value;
}

/**
 * Build a safe JSON error Response. Only `error` (+ optional field
 * `issues` from zod validation) reach the client; full error is logged.
 */
export function safeErrorResponse(
  where: string,
  err: unknown,
  status = 500,
  publicMessage = GENERIC_MESSAGE,
  extra?: Record<string, unknown>,
): Response {
  logServerError(where, err);
  const body: Record<string, unknown> = { error: publicMessage };
  if (extra) {
    for (const [k, v] of Object.entries(extra)) body[k] = sanitizeDetail(v);
  }
  return Response.json(body, { status });
}
