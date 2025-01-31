import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  projects: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      year: z.number(),
      description: z.string(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      highlight: z.boolean().optional(),
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
        img: z
          .object({
            src: image(),
            alt: z.string(),
          })
          .optional(),
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
};
