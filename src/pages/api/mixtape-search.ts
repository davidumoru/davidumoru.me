import type { APIRoute } from "astro";
import { searchTracks } from "../../utils/spotify";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json([]);
  return Response.json(await searchTracks(query));
};
