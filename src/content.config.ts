import {
  defineCollection,
  type CollectionEntry,
  type SchemaContext,
} from "astro:content";
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

const workBase = {
  title: z.string(),
  description: z.string(),
  year: z.number(),
  url: z.string().optional(),
  order: z.number().default(0),
  status: z.enum(["live", "archive", "draft"]).default("live"),
};

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/work" }),
  schema: (ctx) =>
    z.discriminatedUnion("kind", [
      z.object({
        kind: z.literal("project"),
        ...workBase,
        role: z.string().optional(),
        caseStudy: z.boolean().default(false),
        ...coverFields(ctx),
      }),
      z.object({
        kind: z.literal("play"),
        ...workBase,
        color: z.string(),
      }),
    ]),
});

export const collections = { pages, posts, lab, work };

type WorkEntry = CollectionEntry<"work">;
export type WorkProject = Omit<WorkEntry, "data"> & {
  data: Extract<WorkEntry["data"], { kind: "project" }>;
};
export type WorkPlay = Omit<WorkEntry, "data"> & {
  data: Extract<WorkEntry["data"], { kind: "play" }>;
};
