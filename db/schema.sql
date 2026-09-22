-- Schema for the Turso database behind the site.
-- Apply with: turso db shell <database> < db/schema.sql

CREATE TABLE IF NOT EXISTS GuestBook ("id" integer PRIMARY KEY, "author" text NOT NULL, "link" text, "content" text NOT NULL, "country" text NOT NULL, "timestamp" text NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Mixtape (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  from_name TEXT NOT NULL,
  shell TEXT NOT NULL DEFAULT 'graphite',
  tracks TEXT NOT NULL,
  created_at TEXT NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Stamps ("country" text PRIMARY KEY, "hue" integer NOT NULL, has_image INTEGER NOT NULL DEFAULT 0, imageUrl TEXT NOT NULL DEFAULT '');
