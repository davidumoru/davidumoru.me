export interface ZibaldoneEntry {
  date: Date;
  content: string;
}

export function parseZibaldoneEntries(rawContent: string): ZibaldoneEntry[] {
  const entryPattern = /<!--\s*entry:\s*(\d{4}-\d{2}-\d{2})\s*-->/g;
  const entries: ZibaldoneEntry[] = [];

  const parts = rawContent.split(entryPattern);

  for (let i = 1; i < parts.length; i += 2) {
    const dateStr = parts[i];
    const content = parts[i + 1]?.trim();

    if (dateStr && content) {
      entries.push({
        date: new Date(dateStr),
        content,
      });
    }
  }

  return entries;
}
