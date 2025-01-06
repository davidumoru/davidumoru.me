import { defineCollection, z } from "astro:content";

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
    type: "content",
    schema: z.object({
      title: z.string(),
      date: z.date(),
      description: z.string(),
    }),
  }),
};
