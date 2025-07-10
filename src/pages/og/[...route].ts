import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const collectionEntries = await getCollection("posts");

const pages = Object.fromEntries(
  collectionEntries.map(({ id, data }) => [id, data])
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",

  pages: pages,

  getImageOptions: (route, page) => {
    return {
      title: page.title,
      description: "davidumoru.me",
      bgGradient: [[255, 255, 255]],
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
    };
  },
});
