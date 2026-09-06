import { getCollection } from "astro:content";

export type OgRoute = { slug: string; title: string; description?: string };

const STATIC: OgRoute[] = [
  {
    slug: "bookmarks",
    title: "Bookmarks",
    description:
      "Tools, reads, and corners of the web I've saved and keep coming back to.",
  },
  {
    slug: "bookshelf",
    title: "Bookshelf",
    description: "Books I've read and books I like the idea of having read.",
  },
  {
    slug: "guestbook",
    title: "Guestbook",
    description: "Leave a message and get a travel stamp.",
  },
  {
    slug: "lab",
    title: "Lab",
    description: "Experiments in motion, interaction, and interface craft.",
  },
  {
    slug: "mixtape",
    title: "Mixtape",
    description:
      "Listen to what the last visitor left, then record one for whoever is next.",
  },
  {
    slug: "now",
    title: "Now",
    description: "A running log of what I'm up to and where my head's at.",
  },
  {
    slug: "posts",
    title: "Posts",
    description: "Writing on design, code, and whatever else is on my mind.",
  },
  {
    slug: "posts/archive",
    title: "Archive",
    description: "Older writing, kept around.",
  },
  {
    slug: "scraps",
    title: "Scraps",
    description:
      "Scattered thoughts, quotes, and finds from books, films, and rabbit holes.",
  },
  {
    slug: "travel",
    title: "Travel",
    description: "A map of all countries I've visited or lived in so far.",
  },
  {
    slug: "webrings",
    title: "Webrings",
    description: "Little loops of the small web I'm part of.",
  },
  {
    slug: "work",
    title: "Work",
    description:
      "A mix of things I've made and things I've helped make with others.",
  },
];

export async function ogRoutes(): Promise<OgRoute[]> {
  const [pages, posts, lab, work] = await Promise.all([
    getCollection("pages"),
    getCollection("posts", (e) => e.data.status !== "draft"),
    getCollection("lab", (e) => e.data.status === "live"),
    getCollection(
      "work",
      (e) =>
        e.data.status === "live" &&
        e.data.kind === "project" &&
        e.data.caseStudy,
    ),
  ]);

  return [
    ...STATIC,
    ...pages.map((e) => ({
      slug: e.id,
      title: e.data.title,
      description: e.data.description,
    })),
    ...posts.map((e) => ({
      slug: `posts/${e.id}`,
      title: e.data.title,
      description: e.data.description,
    })),
    ...lab.map((e) => ({
      slug: `lab/${e.id}`,
      title: e.data.title,
      description: e.data.description,
    })),
    ...work
      .filter((e) => e.data.kind === "project")
      .map((e) => ({
        slug: `work/${e.id}`,
        title: e.data.title,
        description: e.data.description,
      })),
  ];
}

export async function ogSlugs(): Promise<Set<string>> {
  return new Set((await ogRoutes()).map((r) => r.slug));
}
