import { getCollection, type CollectionEntry } from "astro:content";

type Status = CollectionEntry<"posts">["data"]["status"];

const byNewest = (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) =>
  b.data.date.getTime() - a.data.date.getTime();

export async function getPosts(status: Status) {
  const posts = await getCollection(
    "posts",
    (post) => post.data.status === status,
  );
  return posts.sort(byNewest);
}

export async function getPublishedPosts() {
  const posts = await getCollection(
    "posts",
    (post) => post.data.status !== "draft",
  );
  return posts.sort(byNewest);
}
