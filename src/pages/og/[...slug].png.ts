import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { ogRoutes, type OgRoute } from "../../utils/og";

const W = 1200;
const H = 630;

const asset = (p: string) => join(process.cwd(), "src/assets", p);

const [sansMedium, background] = await Promise.all([
  readFile(asset("fonts/og/inter-500.ttf")),
  readFile(asset("og-bg.png")),
]);

const bg = `data:image/png;base64,${background.toString("base64")}`;

const TRACKING = -0.04;

const fonts = [
  {
    name: "Inter",
    data: sansMedium,
    weight: 500 as const,
    style: "normal" as const,
  },
];

function card(route: OgRoute) {
  const SIZE = 18;
  const line = {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: SIZE,
    letterSpacing: SIZE * TRACKING,
    lineHeight: 1.35,
    textTransform: "uppercase",
  };

  const children: unknown[] = [
    {
      type: "div",
      props: { style: { ...line, color: "#111111" }, children: route.title },
    },
  ];

  if (route.description) {
    children.push({
      type: "div",
      props: {
        style: { ...line, color: "#8a8a8a", maxWidth: 460 },
        children: route.description,
      },
    });
  }

  return {
    type: "div",
    props: {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 72px 0 64px",
        backgroundColor: "#ffffff",
        backgroundImage: `url(${bg})`,
        backgroundSize: `${W}px ${H}px`,
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children,
          },
        },
      ],
    },
  };
}

export async function getStaticPaths() {
  const routes = await ogRoutes();
  return routes.map((route) => ({
    params: { slug: route.slug },
    props: { route },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const route = props.route as OgRoute;
  const svg = await satori(card(route) as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
