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
  indexes: {
    timestamp_idx: { on: ["timestamp"], unique: false },
  },
});

const Stamps = defineTable({
  columns: {
    country: column.text({ primaryKey: true }),
    imageUrl: column.text(),
    hue: column.number(),
  },
});

export default defineDb({
  tables: { GuestBook, Stamps },
});
