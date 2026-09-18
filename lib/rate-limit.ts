/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

/**
 * Tiered, configurable rate limiter for the App Router.
 * Tiers: `auth` (strict, IP + per-account exponential backoff),
 * `public` (moderate, per IP), `authenticated` (loose, per user).
 * All thresholds come from env vars (see .env.example). In-memory store;
 * swap with KV/Redis for distributed enforcement.
 */

export type RateLimitTier = "auth" | "public" | "authenticated";

export interface RateLimitDecision {
  allowed: boolean;
  retryAfter: number;
  limit: number;
  remaining: number;
  resetAt: number;
}

export interface AuthRateLimitDecision extends RateLimitDecision {
  scope?: "ip" | "account";
  backoffSeconds?: number;
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function envFloat(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export const rateLimitConfig = {
  get auth() {
    return {
      ipMax: envInt("RATE_LIMIT_AUTH_IP_MAX", 20),
      ipWindowSec: envInt("RATE_LIMIT_AUTH_IP_WINDOW_SEC", 900),
      accountMax: envInt("RATE_LIMIT_AUTH_ACCOUNT_MAX", 5),
      accountWindowSec: envInt("RATE_LIMIT_AUTH_ACCOUNT_WINDOW_SEC", 900),
      backoffBaseSec: envInt("RATE_LIMIT_AUTH_BACKOFF_BASE_SEC", 30),
      backoffMultiplier: envFloat("RATE_LIMIT_AUTH_BACKOFF_MULTIPLIER", 2),
      backoffCapSec: envInt("RATE_LIMIT_AUTH_BACKOFF_CAP_SEC", 900),
    };
  },
  get public() {
    return {
      max: envInt("RATE_LIMIT_PUBLIC_MAX", 100),
      windowSec: envInt("RATE_LIMIT_PUBLIC_WINDOW_SEC", 60),
    };
  },
  get authenticated() {
    return {
      max: envInt("RATE_LIMIT_AUTHENTICATED_MAX", 300),
      windowSec: envInt("RATE_LIMIT_AUTHENTICATED_WINDOW_SEC", 60),
    };
  },
};

const windows = new Map<string, number[]>();

interface AccountRecord { failures: number; firstFailureAt: number; lastFailureAt: number; }
const accountFailures = new Map<string, AccountRecord>();

export function getClientIp(request: Request): string {
  const h = request.headers;
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function normalizeAccountKey(raw: string): string {
  return raw.trim().toLowerCase();
}

function slidingCheck(key: string, max: number, windowSec: number, now: number): RateLimitDecision {
  const windowMs = windowSec * 1000;
  const cutoff = now - windowMs;
  const list = windows.get(key) ?? [];
  const fresh = list.filter((t) => t > cutoff);
  if (fresh.length >= max) {
    const resetAt = (fresh[0] ?? now) + windowMs;
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)), limit: max, remaining: 0, resetAt };
  }
  fresh.push(now);
  windows.set(key, fresh);
  if (windows.size > 10_000) pruneWindows(now);
  return { allowed: true, retryAfter: 0, limit: max, remaining: max - fresh.length, resetAt: now + windowMs };
}

function pruneWindows(now: number): void {
  const maxMs = Math.max(rateLimitConfig.auth.ipWindowSec, rateLimitConfig.auth.accountWindowSec, rateLimitConfig.public.windowSec, rateLimitConfig.authenticated.windowSec) * 1000;
  for (const [k, list] of windows) {
    const f = list.filter((t) => now - t < maxMs);
    if (f.length === 0) windows.delete(k); else windows.set(k, f);
  }
}
export function getAccountBackoffSeconds(failures: number): number {
  const cfg = rateLimitConfig.auth;
  if (failures < cfg.accountMax) return 0;
  const delay = cfg.backoffBaseSec * Math.pow(cfg.backoffMultiplier, failures - cfg.accountMax);
  return Math.min(Math.ceil(delay), cfg.backoffCapSec);
}

export function checkAuthRateLimit(ip: string, accountKey: string, now = Date.now()): AuthRateLimitDecision {
  const cfg = rateLimitConfig.auth;
  const ipDecision = slidingCheck(`auth:ip:${ip}`, cfg.ipMax, cfg.ipWindowSec, now);
  if (!ipDecision.allowed) return { ...ipDecision, scope: "ip" };
  const account = normalizeAccountKey(accountKey);
  if (account) {
    const rec = accountFailures.get(`auth:account:${account}`);
    if (rec) {
      if (now - rec.firstFailureAt > cfg.accountWindowSec * 1000) {
        accountFailures.delete(`auth:account:${account}`);
      } else {
        const backoff = getAccountBackoffSeconds(rec.failures);
        if (backoff > 0) {
          const retryAfter = Math.ceil((rec.lastFailureAt + backoff * 1000 - now) / 1000);
          if (retryAfter > 0) {
            return { allowed: false, retryAfter, limit: cfg.accountMax, remaining: 0, resetAt: rec.lastFailureAt + backoff * 1000, scope: "account", backoffSeconds: backoff };
          }
        }
      }
    }
  }
  return { ...ipDecision, scope: undefined, backoffSeconds: 0 };
}

export function recordAuthFailure(accountKey: string, now = Date.now()): { failures: number; backoffSeconds: number } {
  const cfg = rateLimitConfig.auth;
  const key = `auth:account:${normalizeAccountKey(accountKey)}`;
  const prev = accountFailures.get(key);
  const rec = !prev || now - prev.firstFailureAt > cfg.accountWindowSec * 1000
    ? { failures: 1, firstFailureAt: now, lastFailureAt: now }
    : { failures: prev.failures + 1, firstFailureAt: prev.firstFailureAt, lastFailureAt: now };
  accountFailures.set(key, rec);
  return { failures: rec.failures, backoffSeconds: getAccountBackoffSeconds(rec.failures) };
}

export function clearAuthFailures(accountKey: string): void {
  accountFailures.delete(`auth:account:${normalizeAccountKey(accountKey)}`);
}

export function checkPublicRateLimit(ip: string, now = Date.now()): RateLimitDecision {
  const cfg = rateLimitConfig.public;
  return slidingCheck(`public:ip:${ip}`, cfg.max, cfg.windowSec, now);
}

export function checkAuthenticatedRateLimit(userIdOrIp: string, isAuthenticated = true, now = Date.now()): RateLimitDecision {
  const cfg = rateLimitConfig.authenticated;
  const prefix = isAuthenticated ? "authenticated:user" : "authenticated:ip";
  return slidingCheck(`${prefix}:${userIdOrIp}`, cfg.max, cfg.windowSec, now);
}

export function checkRateLimit(tier: RateLimitTier, ip: string, opts?: { accountKey?: string; userId?: string }, now = Date.now()): RateLimitDecision {
  if (tier === "auth") return checkAuthRateLimit(ip, opts?.accountKey ?? "", now);
  if (tier === "authenticated") return checkAuthenticatedRateLimit(opts?.userId ?? ip, Boolean(opts?.userId), now);
  return checkPublicRateLimit(ip, now);
}

export function rateLimitHeaders(d: RateLimitDecision): Record<string, string> {
  return { "Retry-After": String(d.retryAfter), "X-RateLimit-Limit": String(d.limit), "X-RateLimit-Remaining": String(d.remaining), "X-RateLimit-Reset": String(Math.ceil(d.resetAt / 1000)) };
}

export function applyRateLimitHeaders(res: Response, d: RateLimitDecision): void {
  const h = rateLimitHeaders(d);
  for (const [k, v] of Object.entries(h)) res.headers.set(k, v);
}

export function rateLimitedResponse(d: AuthRateLimitDecision, message?: string): Response {
  const body = { error: message ?? "Too many requests. Please try again later." };
  const res = Response.json(body, { status: 429 });
  applyRateLimitHeaders(res, d);
  return res;
}

export function __resetRateLimitState(): void {
  windows.clear(); accountFailures.clear();
}
