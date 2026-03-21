import type { APIRoute } from "astro";
import { getSpotifyData } from "../../lib/spotify";

export const GET: APIRoute = async () => {
  const data = await getSpotifyData();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
