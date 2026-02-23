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
      images: z
        .array(
          z.object({
            url: z.string(),
            alt: z.string().optional(),
          }),
        )
        .optional(),
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
        type: z.enum(["personal", "technical"]),
        img: image().array().optional(),
        imgAlt: z.string().optional(),
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
        datePublished: z.date().optional(),
        dateModified: z.date().optional(),
        img: image().array().optional(),
        imgAlt: z.string().optional(),
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
  lab: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/lab" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        datePublished: z.date(),
        componentKey: z.string(),
        coverImage: image().optional(),
        coverAlt: z.string().optional(),
        repositoryUrl: z.string().url().optional(),
        draft: z.boolean().optional().default(false),
      }),
  }),
  books: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/books" }),
    schema: z.object({
      title: z.string(),
      author: z.string(),
      coverUrl: z.string().url(),
      reviewUrl: z.string().url().optional(),
    }),
  }),
  zibaldone: defineCollection({
    loader: glob({
      pattern: "**/[^_]*.{md,mdx}",
      base: "./src/content/zibaldone",
    }),
    schema: z.object({
      month: z.string(),
    }),
  }),
  bookmarks: defineCollection({
    type: "data",
    schema: z.object({
      name: z.string(),
      order: z.number(),
      bookmarks: z.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          favicon: z.string().optional(),
        }),
      ),
    }),
  }),
};
