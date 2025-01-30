// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "ignore",
  site: "https://davidumoru.me",
  integrations: [
    expressiveCode({
      defaultProps: {
        wrap: true,
        overridesByLang: {
          "bash,ps,sh": { preserveIndent: false },
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },

  adapter: vercel(),
});
