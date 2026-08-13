export const PER_PAGE = 19;

const STAMP_BASE = "https://guestbook.umorucdn.xyz/stamps";

function countrySlug(country: string): string {
  return country
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stampImageUrl(country: string): string {
  return `${STAMP_BASE}/${countrySlug(country)}.webp`;
}
