import type { APIRoute } from "astro";
import { getNowPlaying } from "../../utils/spotify";

export const prerender = false;

export const GET: APIRoute = async () => {
  const track = await getNowPlaying();
  return Response.json(track);
};
