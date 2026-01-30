import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const postEntries = await getCollection("posts");
const labEntries = await getCollection("lab");
const pageEntries = await getCollection("pages");

const staticPages = {
  index: {
    title: "David Umoru",
    description:
      "Design Engineer",
  },
  bookshelf: {
    title: "Bookshelf",
    description: "Books I've read and books I like the idea of having read.",
  },
  guestbook: {
    title: "Guestbook",
    description: "Leave a message and get a travel stamp!",
  },
  now: {
    title: "Now",
    description: "What I'm up to right now",
  },
  projects: {
    title: "Projects",
    description: "Some of my favorite things I've built",
  },
  webrings: {
    title: "Webrings",
    description: "Webrings this site belong to",
  },
  lab: {
    title: "Lab",
    description: "UI experiments and interactive design",
  },
  posts: {
    title: "Posts",
    description:
      "Essays, notes, and writings on development, design, tools, and personal reflection.",
  },
  zibaldone: {
    title: "Zibaldone",
    description: "Scattered thoughts, ideas, and quotes from books, films and rabbit holes.",
  },
  bookmarks: {
    title: "Bookmarks",
    description: "A curated collection of links and resources I find useful or interesting.",
  },
  directory: {
    title: "Directory",
    description: "A list of everything on my site",
  },
};

const collectionPages = [
  ...postEntries.map((entry) => ({
    id: `posts/${entry.id}`,
    title: entry.data.title,
    description: entry.data.description ?? "",
  })),
  ...labEntries.map((entry) => ({
    id: `lab/${entry.id}`,
    title: entry.data.title,
    description: entry.data.description ?? "",
  })),
  ...pageEntries.map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description ?? "",
  })),
];

const pages = {
  ...Object.fromEntries(
    collectionPages.map(({ id, title, description }) => [
      id,
      { title, description },
    ])
  ),
  ...staticPages,
};

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (route, page) => ({
    title: page.title,
    description: page.description || "davidumoru.me",
    bgGradient: [[255, 255, 255]],
    logo: {
      path: "./public/static/signature/umoru.png",
      size: [534, 100],
    },
    font: {
      title: {
        color: [0, 0, 0],
        size: 72,
        weight: "Bold",
      },
      description: {
        color: [100, 100, 100],
        size: 30,
      },
    },
    padding: 100,
  }),
});
