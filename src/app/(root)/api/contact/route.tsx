import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.FORMSPREE_FORM_ID)
      throw "Contact form is not configured yet. Please email directly.";

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
      message.trim().length > 3000 ||
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

    return NextResponse.json({ ok: true });
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
