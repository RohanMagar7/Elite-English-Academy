/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

/**
 * Client-side error helper: convert unknown/supabase errors into a
 * generic, user-safe message. Never surfaces stack traces, file paths,
 * or raw database text in toasts/alerts.
 *
 * Policy: DENY by default. Only a small allowlist of curated,
 * non-technical prefixes (network issues, rate limits, validation
 * messages from our own API) is shown; everything else collapses to a
 * generic fallback. Full detail goes to console.error for debugging.
 */
const SAFE_PREFIXES = [
  "please ",
  "invalid ",
  "too many",
  "try again in",
  "network",
  "failed to fetch",
  "fetch failed",
  "you don't have permission",
  "this record already exists",
  "invalid data.",
  "create failed",
  "update failed",
  "delete failed",
  "save failed",
  "something went wrong",
  "unable to ",
  "unknown login id",
  "unable to resolve login id",
];

export function safeClientMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  let raw = "";
  if (err instanceof Error) raw = err.message;
  else if (typeof err === "string") raw = err;
  else if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message: unknown }).message === "string") {
    raw = (err as { message: string }).message;
  }
  if (raw) console.error(err);
  const trimmed = raw.trim();
  // Never surface anything resembling internals, even if short.
  if (!trimmed || trimmed.length > 200) return fallback;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("postgres") || lower.includes("supabase") || lower.includes("row-level") ||
    lower.includes("constraint") || lower.includes("duplicate key") || lower.includes("violates") ||
    trimmed.includes("/") || trimmed.includes("\\") || /\bat\b .+\.(tsx?|jsx?|mjs)/.test(trimmed) ||
    lower.includes("stack") || /error\s*(code)?:?\s*(pgrst|23\d{3}|22\d{3}|42501)/.test(lower)
  ) {
    return fallback;
  }
  if (SAFE_PREFIXES.some((p) => lower.startsWith(p))) return trimmed;
  return fallback;
}

