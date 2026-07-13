import iso from "iso-3166-1";

// Territories, dependencies, and disputed areas — not UN member states.
const NON_MEMBER_ALPHA2 = new Set([
  "AQ",
  "AS",
  "GU",
  "MP",
  "PR",
  "VI",
  "UM",
  "HK",
  "MO",
  "GL",
  "FO",
  "GF",
  "GP",
  "MQ",
  "RE",
  "YT",
  "PM",
  "BL",
  "MF",
  "WF",
  "NC",
  "PF",
  "AW",
  "CW",
  "SX",
  "BQ",
  "AI",
  "BM",
  "VG",
  "KY",
  "MS",
  "TC",
  "FK",
  "GI",
  "GG",
  "JE",
  "IM",
  "SH",
  "PN",
  "CK",
  "NU",
  "TK",
  "NF",
  "CX",
  "CC",
  "HM",
  "BV",
  "GS",
  "IO",
  "TF",
  "AX",
  "EH",
  "TW",
  "PS",
  "SJ",
  "VA",
]);

export function isUnMemberState(numericId: string): boolean {
  const entry = iso.whereNumeric(numericId);
  if (!entry) return false;
  return !NON_MEMBER_ALPHA2.has(entry.alpha2);
}

export function countryNameFromId(
  numericId: string,
  topoName?: unknown,
): string {
  return (
    iso.whereNumeric(numericId)?.country ??
    (typeof topoName === "string" ? topoName : "Unknown")
  );
}
