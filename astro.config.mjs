// @ts-check
import { defineConfig } from "astro/config";
import externalize from "./src/plugins/externalize";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "ignore",
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [[externalize, { domain: "davidumoru.me" }]],
  },
  redirects: {
    "/live": { status: 302, destination: "https://twitch.tv/thedavidumoru" },
  },
});
