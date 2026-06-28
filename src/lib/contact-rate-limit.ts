import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const CONTACT_RATE_COOKIE = "contact_rate";
export const MAX_MESSAGES = 2;
export const WINDOW_MS = 24 * 60 * 60 * 1000;

type RateLimitState = {
  count: number;
  resetAt: number;
};

export type RateLimitStatus = {
  allowed: boolean;
  count: number;
  remaining: number;
  resetAt: number | null;
  blocked: boolean;
};

function getSigningSecret(): string {
  return process.env.RECAPTCHA_SECRET_KEY ?? "dev-contact-rate-limit";
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

function encodeState(state: RateLimitState): string {
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeState(value: string): RateLimitState | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;
  } catch {
    return null;
  }

  try {
    const state = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as RateLimitState;
    if (typeof state.count !== "number" || typeof state.resetAt !== "number")
      return null;
    return state;
  } catch {
    return null;
  }
}

function parseCookie(request: Request): RateLimitState | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${CONTACT_RATE_COOKIE}=([^;]+)`)
  );
  if (!match) return null;
  return decodeState(decodeURIComponent(match[1]));
}

function activeState(raw: RateLimitState | null): RateLimitState | null {
  if (!raw) return null;
  if (Date.now() >= raw.resetAt) return null;
  return raw;
}

export function getRateLimit(request: Request): RateLimitStatus {
  const state = activeState(parseCookie(request));
  const count = state?.count ?? 0;
  const resetAt = state?.resetAt ?? null;
  const remaining = Math.max(0, MAX_MESSAGES - count);
  const blocked = count >= MAX_MESSAGES && resetAt !== null;

  return {
    allowed: !blocked,
    count,
    remaining,
    resetAt,
    blocked,
  };
}

export function nextStateAfterSend(status: RateLimitStatus): RateLimitState {
  const now = Date.now();
  if (status.count === 0 || status.resetAt === null || now >= status.resetAt) {
    return { count: 1, resetAt: now + WINDOW_MS };
  }
  return { count: status.count + 1, resetAt: status.resetAt };
}

export function attachRateLimitCookie(
  response: NextResponse,
  state: RateLimitState
): void {
  const now = Date.now();
  const maxAge = Math.max(1, Math.ceil((state.resetAt - now) / 1000));
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set(CONTACT_RATE_COOKIE, encodeState(state), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function rateLimitPayload(status: RateLimitStatus) {
  return {
    remaining: status.remaining,
    resetAt: status.resetAt,
    blocked: status.blocked,
  };
}

export function formatResetTime(resetAt: number): string {
  return new Date(resetAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
