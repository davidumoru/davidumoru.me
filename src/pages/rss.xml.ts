import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .filter((post) => post.data.status !== "draft")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "David Umoru",
    description:
      "Writing from David Umoru on software, design, and whatever catches my attention.",
    site: context.site!,
    stylesheet: "/rss-styles.xsl",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.id}`,
    })),
  });
}
