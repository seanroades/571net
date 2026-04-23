const ARTIST_IDS = [
  "13lXiN6Ku6ZKnP1BeJQjWB",
  "2bPwEZCPO2BeiFn5WhiQTP",
];

export type Release = {
  id: string;
  date: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  albumType: string;
};

async function getToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Missing Spotify credentials");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3500 },
  });

  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchArtistReleases(artistId: string, token: string): Promise<Release[]> {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single,album&limit=50&market=US`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error(`Spotify albums error: ${res.status}`);
  const data = await res.json();

  return (data.items ?? []).map((album: {
    id: string;
    name: string;
    release_date: string;
    artists: { name: string }[];
    external_urls: { spotify: string };
    album_type: string;
  }) => ({
    id: album.id,
    date: album.release_date,
    title: album.name,
    artist: album.artists.map((a) => a.name).join(", "),
    spotifyUrl: album.external_urls.spotify,
    albumType: album.album_type,
  }));
}

export async function fetchAllReleases(): Promise<Release[]> {
  const token = await getToken();
  const results = await Promise.all(
    ARTIST_IDS.map((id) => fetchArtistReleases(id, token))
  );
  return results
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date));
}
