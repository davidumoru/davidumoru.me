import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  projects: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      year: z.number(),
      description: z.string(),
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
};
