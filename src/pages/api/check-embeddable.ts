export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ embeddable: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const xFrameOptions = response.headers.get("x-frame-options");
    const csp = response.headers.get("content-security-policy");

    let embeddable = true;

    if (xFrameOptions) {
      const val = xFrameOptions.toUpperCase().trim();
      if (val === "DENY" || val === "SAMEORIGIN") {
        embeddable = false;
      }
    }

    if (embeddable && csp) {
      const frameAncestorsDirective = csp
        .split(";")
        .map((d) => d.trim())
        .find((d) => d.toLowerCase().startsWith("frame-ancestors"));

      if (frameAncestorsDirective) {
        const val = frameAncestorsDirective.toLowerCase();
        if (val.includes("'none'") || val.includes("'self'")) {
          embeddable = false;
        }
      }
    }

    return new Response(JSON.stringify({ embeddable }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    // Network error or timeout - assume embeddable optimistically
    return new Response(JSON.stringify({ embeddable: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
