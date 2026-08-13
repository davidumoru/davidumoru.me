import { turso } from "./turso";

export type Country = { country: string; hue: number };

let cached: Country[] | null = null;

export async function getStampCountries(): Promise<Country[]> {
  if (!cached) {
    const { rows } = await turso.execute(
      "SELECT country, hue FROM Stamps ORDER BY country ASC",
    );
    cached = rows as unknown as Country[];
  }
  return cached;
}
