import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  projects: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      year: z.number(),
      description: z.string(),
      role: z.string().optional(),
      location: z.string().optional(),
      technologies: z.string().optional(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
    }),
  }),
  posts: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        datePublished: z.date(),
        dateModified: z.date().optional(),
        writing: z.boolean(),
        img: image().array().optional(),
        imgAlt: z.string().optional(),
        ogImage: image().optional(),
        features: z
          .object({
            name: z.string(),
            url: z.string().url(),
          })
          .array()
          .optional(),
      }),
  }),
  pages: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        datePublished: z.date(),
        dateModified: z.date().optional(),
        img: image().array().optional(),
        imgAlt: z.string().optional(),
        ogImage: image().optional(),
      }),
  }),
  now: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/now" }),
    schema: () =>
      z.object({
        date: z.date(),
      }),
  }),
  webrings: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url(),
      prev: z.string().url(),
      next: z.string().url(),
      color: z.string(),
    }),
  }),
};
