import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const postEntries = await getCollection("posts");
const labEntries = await getCollection("lab");
const pageEntries = await getCollection("pages");

const staticPages = {
  index: {
    title: "David Umoru",
  },
  bookshelf: {
    title: "Bookshelf",
  },
  guestbook: {
    title: "Guestbook",
  },
  now: {
    title: "Now",
  },
  projects: {
    title: "Projects",
  },
  webrings: {
    title: "Webrings",
  },
  lab: {
    title: "Lab",
  },
  posts: {
    title: "Posts",
  },
};

const collectionPages = [
  ...postEntries.map((entry) => ({
    id: `posts/${entry.id}`,
    data: entry.data,
  })),
  ...labEntries.map((entry) => ({
    id: `lab/${entry.id}`,
    data: entry.data,
  })),
  ...pageEntries.map((entry) => ({
    id: entry.id,
    data: entry.data,
  })),
];

const pages = {
  ...Object.fromEntries(collectionPages.map(({ id, data }) => [id, data])),
  ...staticPages,
};

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (route, page) => ({
    title: page.title,
    description: "davidumoru.me",
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
