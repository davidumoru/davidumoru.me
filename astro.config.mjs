// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "ignore",
  integrations: [mdx()],

  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },

  adapter: vercel(),
});