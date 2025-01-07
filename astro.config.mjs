// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "ignore",
  site: "https://davidumoru.me",
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },

  adapter: vercel(),
});
