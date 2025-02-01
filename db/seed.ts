import { db, GuestBook } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(GuestBook).values([
    {
      author: "David Umoru",
      link: "https://davidumoru.me",
      content: "Hey, welcome to my guestbook!",
    },
    {
      author: "Gideon",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: "This is so cool!",
    },
  ]);
}
