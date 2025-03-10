// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

import db from "@astrojs/db";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  trailingSlash: "ignore",
  site: "https://davidumoru.me",
  integrations: [expressiveCode({
    defaultProps: {
      wrap: true,
      overridesByLang: {
        "bash,ps,sh": { preserveIndent: false },
      },
    },
    themes: ["rose-pine-dawn"],
  }), mdx(), sitemap(), db(), react()],
  markdown: {
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },
  redirects: {
    "/blog": "/posts",
    "/blog/[slug]": "/posts/[slug]",
    "/live": "https://www.twitch.tv/thedavidumoru",
  },
  adapter: vercel(),
});