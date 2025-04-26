import { db, GuestBook } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(GuestBook).values([
    {
      author: "David Umoru",
      link: "https://davidumoru.me",
      content: "Hey, welcome to my guestbook!",
      country: "Nigeria",
    },
    {
      author: "Gideon",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: "This is so cool!",
      country: "Canada",
    },
    {
      author: "Alice Johnson",
      link: "https://alice.dev",
      content: "Love your work, keep it up!",
      country: "USA",
    },
    {
      author: "Bob Smith",
      link: "",
      content: "Just dropping by to say hi!",
      country: "UK",
    },
    {
      author: "Charlie Adams",
      link: "https://charlieadams.blog",
      content: "Great site, David!",
      country: "Australia",
    },
    {
      author: "Eva Williams",
      link: "https://evaw.design",
      content: "As a designer, I really appreciate the aesthetics here.",
      country: "France",
    },
    {
      author: "Frank Miller",
      link: "",
      content: "This guestbook idea is awesome!",
      country: "Germany",
    },
    {
      author: "Grace Lee",
      link: "https://gracecodes.dev",
      content: "Nice work! Looking forward to more updates.",
      country: "South Korea",
    },
    {
      author: "Henry Thompson",
      link: "",
      content: "This reminds me of old-school web guestbooks. Love it!",
      country: "Ireland",
    },
    {
      author: "Isla Fitzgerald",
      link: "https://isla.io",
      content: "Leaving my mark here! 👋",
      country: "New Zealand",
    },
    {
      author: "Jack Anderson",
      link: "",
      content: "Amazing job, David!",
      country: "Brazil",
    },
    {
      author: "Karen Roberts",
      link: "https://karenroberts.tech",
      content: "Your site is really inspiring!",
      country: "Japan",
    },
  ]);
}
