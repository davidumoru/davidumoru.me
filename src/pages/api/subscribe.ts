import type { APIRoute } from "astro";
import { BUTTONDOWN_API_KEY } from "astro:env/server";

export const prerender = false;

const ENDPOINT = "https://api.buttondown.com/v1/subscribers";
const TIMEOUT = 8_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  if (!BUTTONDOWN_API_KEY) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, type: "unactivated" }),
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (res.ok) return Response.json({ status: "subscribed" });

    const detail = await res.text();
    if (res.status === 400 && /already|exists/i.test(detail)) {
      return Response.json({ status: "existing" });
    }

    console.error("[subscribe]", res.status, detail.slice(0, 200));
    return Response.json({ error: "unavailable" }, { status: 502 });
  } catch (error) {
    console.error(
      "[subscribe]",
      error instanceof Error ? error.message : error,
    );
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
};
