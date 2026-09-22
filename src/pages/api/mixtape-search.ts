import type { APIRoute } from "astro";
import { searchTracks } from "../../utils/spotify";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json([]);

  try {
    return Response.json(await searchTracks(query));
  } catch (error) {
    console.error(
      "[mixtape-search]",
      error instanceof Error ? error.message : error,
    );
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
};
