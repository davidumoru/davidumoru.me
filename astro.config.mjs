// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

import db from "@astrojs/db";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  trailingSlash: "ignore",
  site: "https://davidumoru.me",

  integrations: [
    expressiveCode({
      defaultProps: {
        wrap: false,
        overridesByLang: {
          "bash,ps,sh": { preserveIndent: false },
        },
      },
      themes: ["rose-pine-dawn", "rose-pine"],
      useThemedSelectionColors: true,
    }),
    mdx(),
    sitemap(),
    db(),
    react(),
  ],

  markdown: {
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },

  redirects: {
    "/blog": "/posts",
    "/live": "https://www.twitch.tv/thedavidumoru",
  },

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});