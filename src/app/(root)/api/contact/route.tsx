import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from "@/constants/contact";
import {
  attachRateLimitCookie,
  formatResetTime,
  getRateLimit,
  MAX_MESSAGES,
  nextStateAfterSend,
  rateLimitPayload,
} from "@/lib/contact-rate-limit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const status = getRateLimit(request);
  return NextResponse.json(rateLimitPayload(status));
}

export async function POST(request: Request) {
  try {
    if (!process.env.FORMSPREE_FORM_ID)
      throw "Contact form is not configured yet. Please email directly.";

    const rateLimit = getRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `You've used your 2 messages for today. You can contact again at ${formatResetTime(rateLimit.resetAt!)}.`,
          ...rateLimitPayload(rateLimit),
        },
        { status: 429 }
      );
    }

    const data = await request.json();
    const { name, email, message, recaptcha_token } = data;
    if (!name || !email || !message) throw "Invalid data, please try again!";

    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptcha_token) throw "Invalid data, please try again!";
      const captcha = await verifyCaptcha(recaptcha_token);
      if (
        !captcha?.success ||
        captcha.score < 0.5 ||
        captcha.action !== "contact"
      )
        throw "Invalid, please try again!";
    }

    if (
      name.trim().length > 300 ||
      message.trim().length < MESSAGE_MIN_LENGTH ||
      message.trim().length > MESSAGE_MAX_LENGTH ||
      (message.length > 14 && !message.includes(" "))
    )
      throw "Invalid message content";

    const res = await fetch(
      `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `Portfolio contact from ${name}`,
        }),
      }
    );

    const result = await res.json();
    if (!res.ok || !result.ok)
      throw result.error ?? result.message ?? "Failed to send message";

    const newState = nextStateAfterSend(rateLimit);
    const response = NextResponse.json({
      ok: true,
      remaining: Math.max(0, MAX_MESSAGES - newState.count),
      resetAt: newState.resetAt,
      blocked: newState.count >= 2,
    });
    attachRateLimitCookie(response, newState);
    return response;
  } catch (error: any) {
    console.log("# contact error: ", error);
    return NextResponse.json(
      {
        error: typeof error === "string" ? error : error?.message ?? `${error}`,
      },
      { status: 400 }
    );
  }
}

const verifyCaptcha = async (token: string) => {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });

  return res.json();
};
