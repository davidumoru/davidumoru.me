import { createClient } from "@libsql/client/web";
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "astro:env/server";

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});
