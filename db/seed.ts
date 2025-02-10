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
    {
      author: "Alice Johnson",
      link: "https://alice.dev",
      content: "Love your work, keep it up!",
    },
    {
      author: "Bob Smith",
      link: "",
      content: "Just dropping by to say hi!",
    },
    {
      author: "Charlie Adams",
      link: "https://charlieadams.blog",
      content: "Great site, David!",
    },
    {
      author: "Eva Williams",
      link: "https://evaw.design",
      content: "As a designer, I really appreciate the aesthetics here.",
    },
    {
      author: "Frank Miller",
      link: "",
      content: "This guestbook idea is awesome!",
    },
    {
      author: "Grace Lee",
      link: "https://gracecodes.dev",
      content: "Nice work! Looking forward to more updates.",
    },
    {
      author: "Henry Thompson",
      link: "",
      content: "This reminds me of old-school web guestbooks. Love it!",
    },
    {
      author: "Isla Fitzgerald",
      link: "https://isla.io",
      content: "Leaving my mark here! 👋",
    },
    {
      author: "Jack Anderson",
      link: "",
      content: "Amazing job, David!",
    },
    {
      author: "Karen Roberts",
      link: "https://karenroberts.tech",
      content: "Your site is really inspiring!",
    },
  ]);
}
