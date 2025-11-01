import { defineDb, defineTable, column, NOW } from "astro:db";

const GuestBook = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    author: column.text(),
    link: column.text({ optional: true }),
    content: column.text(),
    country: column.text(),
    timestamp: column.date({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { GuestBook },
});
