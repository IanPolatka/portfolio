const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=4";
const CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

export async function getSpotifyData() {
  const basicAuth = Buffer.from(
    `${import.meta.env.SPOTIFY_CLIENT_ID}:${import.meta.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  // 1️⃣ Get access token
  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: import.meta.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const { access_token } = await tokenRes.json();

  // 2️⃣ Check currently playing
  const nowRes = await fetch(CURRENTLY_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  let featuredTrack = null;
  let isPlaying = false;

  if (nowRes.status === 200) {
    const nowData = await nowRes.json();
    if (nowData?.is_playing) {
      featuredTrack = nowData.item;
      isPlaying = true;
    }
  }

  // 3️⃣ Fetch recently played
  const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const recentData = await recentRes.json();

  // 4️⃣ Fallback if nothing currently playing
  if (!featuredTrack && recentData?.items?.length) {
    featuredTrack = recentData.items[0].track;
  }

  return {
    featuredTrack,
    isPlaying,
    tracks: recentData.items,
  };
}
