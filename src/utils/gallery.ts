import { getCollection } from "astro:content";
import { getImage } from "astro:assets";

export const COMING_SOON = true;
export const STACK = 3;

const FULL = { width: 1400, height: 933 };
const THUMB = { width: 160, height: 107 };

export type GalleryPhoto = {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
};

export async function getAlbums() {
  const entries = (await getCollection("gallery")).sort(
    (a, b) => a.data.order - b.data.order,
  );

  return Promise.all(
    entries.map(async (entry) => ({
      id: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      photos: await Promise.all(
        entry.data.photos.map(async ({ src, alt }): Promise<GalleryPhoto> => {
          const [full, thumb] = await Promise.all([
            getImage({ src, ...FULL, fit: "cover" }),
            getImage({ src, ...THUMB, fit: "cover" }),
          ]);
          return { src: full.src, thumb: thumb.src, alt, ...FULL };
        }),
      ),
    })),
  );
}

export type GalleryAlbum = Awaited<ReturnType<typeof getAlbums>>[number];

export const photoName = (album: string, index: number) =>
  `gallery-${album}-${index}`;
