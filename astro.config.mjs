// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeExternalLinks from "rehype-external-links";
import { unified } from "@astrojs/markdown-remark";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://davidumoru.me",
  prefetch: true,

  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  devToolbar: {
    enabled: false,
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/InterVariable.woff2"],
          },
          {
            weight: "100 900",
            style: "italic",
            src: ["./src/assets/fonts/InterVariable-Italic.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Instrument Serif",
      cssVariable: "--font-instrument-serif",
      weights: [400],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["100 900"],
    },
    {
      provider: fontProviders.google(),
      name: "Mynerve",
      cssVariable: "--font-mynerve",
      weights: [400],
    },
  ],

  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener"],
            content: { type: "text", value: " (opens in new tab)" },
            contentProperties: { className: ["sr-only"] },
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  integrations: [sitemap(), mdx(), react()],
  adapter: vercel(),
});
