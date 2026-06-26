import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const coverFields = ({ image }: SchemaContext) => ({
  cover: z.union([z.url(), image()]).optional(),
  coverAlt: z.string().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: (ctx) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      ...coverFields(ctx),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: (ctx) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      status: z.enum(["live", "archive", "draft"]).default("live"),
      ...coverFields(ctx),
    }),
});

const lab = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/lab" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      status: z.enum(["live", "archive", "draft"]).default("live"),
      poster: image().optional(),
    }),
});

export const collections = { pages, posts, lab };
