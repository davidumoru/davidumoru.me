export const DEFAULT_HUE = 210;

export function stampVars(hue: number): Record<string, string> {
  return {
    "--hue": String(hue),
    "--primary-stamp-color": `oklch(0.55 0.15 ${hue})`,
    "--light-stamp-bg": `oklch(0.97 0.015 ${hue})`,
    "--text-bg-overlay": `oklch(0.98 0.01 ${hue} / 0.7)`,
    "--dark-text-fixed": `oklch(0.3 0.07 ${hue})`,
    "--mid-grey-fixed": `oklch(0.53 0.02 ${hue})`,
    "--gold-accent": `oklch(0.82 0.14 88)`,
    "--postmark-color-fixed": `oklch(0.38 0.06 ${hue} / 0.8)`,
    "--border-accent": `oklch(0.5 0.1 ${hue})`,
    "--action-color": `oklch(0.45 0.15 ${hue})`,
  };
}

export function stampStyle(hue: number, rotate?: number): string {
  const vars = stampVars(hue);
  if (rotate !== undefined) vars["--rotate"] = `${rotate}deg`;
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

export function applyStampVars(el: HTMLElement, hue: number) {
  for (const [key, value] of Object.entries(stampVars(hue))) {
    el.style.setProperty(key, value);
  }
}
