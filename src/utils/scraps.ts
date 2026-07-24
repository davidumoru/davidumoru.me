export interface Scrap {
  content: string;
  image?: { src: string; alt: string; caption?: string };
}

const DIVIDER_PATTERN = /^[ \t]{0,3}[-*_](?:[ \t]*[-*_]){2,}[ \t]*$/m;
const IMAGE_ONLY_PATTERN = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;

function stripLeadingHeadings(text: string): string {
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length && (/^#{1,6}\s/.test(lines[i]) || !lines[i].trim())) {
    i++;
  }
  return lines.slice(i).join("\n").trim();
}

export function parseScraps(rawContent: string): Scrap[] {
  return rawContent
    .split(DIVIDER_PATTERN)
    .map((part) => stripLeadingHeadings(part.trim()))
    .filter(Boolean)
    .map((content) => {
      const image = content.match(IMAGE_ONLY_PATTERN);
      return {
        content,
        ...(image && {
          image: {
            alt: image[1],
            src: image[2],
            ...(image[3] && { caption: image[3] }),
          },
        }),
      };
    });
}
