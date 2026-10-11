export type Playlist = {
  id: string;
  url: string;
  title: string;
  cover?: string;
  note?: string;
};

export async function getPlaylist(entry: {
  id: string;
  data: { url: string; note?: string };
}): Promise<Playlist> {
  const { url, note } = entry.data;
  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();
    return {
      id: entry.id,
      url,
      note,
      title: data.title ?? entry.id,
      cover: data.thumbnail_url,
    };
  } catch {
    return { id: entry.id, url, note, title: entry.id };
  }
}
