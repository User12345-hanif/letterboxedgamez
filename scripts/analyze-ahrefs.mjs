/**
 * Reproducible analysis of the Ahrefs competitor keyword export.
 *
 * Usage: node scripts/analyze-ahrefs.mjs
 * Reads docs/ahrefs-letter-boxed-export.csv (verbatim copy of the
 * upload `letter_boxed.csv`) and writes docs/ahrefs-classified.csv
 * with the original columns preserved plus Brand class, Intent,
 * Mapped page and Priority/action. Prints the summary totals so a
 * re-run can be checked against docs/seo-keyword-map.md.
 *
 * File quirk, documented so re-parsing reproduces: the upload is
 * UTF-16LE, tab-separated, quoted fields, but is prefixed by two
 * U+FFFD replacement characters (6 bytes, EF BF BD EF BF BD) before
 * the UTF-16LE data. The parser strips that prefix (and a plain
 * UTF-8 BOM, if present) before decoding as UTF-16LE.
 *
 * What the export does NOT contain: no keyword-difficulty (KD)
 * column, no ranking URL column, and no per-country volume except
 * "Top location's volume". Feasibility below is therefore judged
 * only from the competitor's average position (a low position
 * means the incumbent is strong) plus specificity and relevance.
 * No ranking is promised by any priority here.
 *
 * Brand rules (conservative, deliberate):
 *  - "Letterboxd" is a different brand (film site) and "Wordle"
 *    is another publisher's brand: never targeted.
 *  - Any keyword naming NYT / New York Times / NYTimes / NY is
 *    trademark-sensitive: never targeted, never used in copy.
 *  - "letter boxed" / "letterboxed" / "letterbox" and close
 *    variants are the incumbent game's name: never targeted in
 *    titles, headings, URLs or copy. Demand for those phrases is
 *    recorded as a demand signal only.
 *  - Misspellings (bixed, bozed, voxed, boxxed, leter, lettered,
 *    boxedletter, wordboxed, letterboxes) are excluded: no value
 *    in chasing typos, and writing them into copy is stuffing.
 *  - "Generic" means the phrase describes the format without any
 *    brand or game-name token (e.g. "letter box game", "letter
 *    board game"). That set is small, and the map says so plainly.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "docs/ahrefs-letter-boxed-export.csv");
const OUT = join(root, "docs/ahrefs-classified.csv");

function parseTsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === "\t") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // Ignore CR in CRLF.
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0].trim() !== "");
}

const raw = readFileSync(SRC);
let bytes = raw;
if (bytes[0] === 0xef && bytes[1] === 0xbf && bytes[2] === 0xbd && bytes[3] === 0xef && bytes[4] === 0xbf && bytes[5] === 0xbd) {
  bytes = bytes.subarray(6);
} else if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
  bytes = bytes.subarray(3);
}
const text = new TextDecoder("utf-16le").decode(bytes).replace(/^\uFEFF/, "");
const table = parseTsv(text);
const headers = table[0];
const EXPECTED = [
  "Keyword",
  "Volume",
  "Organic traffic",
  "Paid traffic",
  "Average position",
  "Locations",
  "Top location",
  "Top location code",
  "Top location's volume",
  "Top location's traffic",
];
if (headers.join("|") !== EXPECTED.join("|")) {
  throw new Error(`Unexpected header: ${headers.join(" | ")}`);
}

const num = (v) => {
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
};

const TYPO_TOKENS = new Set(["bixed", "bozed", "voxed", "boxxed", "leter", "lettered", "boxer", "boxedletter", "wordboxed"]);

function tokens(keyword) {
  return keyword.toLowerCase().match(/[a-z]+/g) ?? [];
}

function brandClass(keyword) {
  const toks = tokens(keyword);
  const raw = keyword.toLowerCase().replace(/[^a-z]/g, "");
  if (raw.includes("letterboxd")) return "branded-other (Letterboxd)";
  if (toks.includes("wordle")) return "branded-other (Wordle)";
  if (
    toks.includes("nyt") ||
    toks.includes("nytimes") ||
    toks.includes("ny") ||
    toks.includes("nyc") ||
    raw.includes("nytimes") ||
    raw.includes("nyt") ||
    (toks.includes("new") && toks.includes("york")) ||
    toks.includes("times")
  ) {
    return "branded-nyt";
  }
  if (toks.some((t) => TYPO_TOKENS.has(t)) || toks.includes("letterboxes")) return "typo/variant";
  if ((toks.includes("letter") && toks.includes("boxed")) || toks.includes("letterboxed") || raw.includes("letterboxed")) {
    return "branded-game-name";
  }
  if (toks.includes("letterbox")) return "branded-game-name";
  if (toks.includes("boxed") && toks.includes("letters")) return "branded-game-name";
  return "generic";
}

function intentOf(keyword) {
  const joined = tokens(keyword).join(" ");
  if (joined.includes("how to play") || joined.includes("how do you play") || joined.includes("rules") || joined.includes("what is the goal")) {
    return "how-to";
  }
  const toks = new Set(tokens(keyword));
  if (["answers", "archive", "archives", "today", "todays", "yesterday", "old"].some((t) => toks.has(t))) return "answers-archive";
  if (toks.has("games") && toks.has("like")) return "alternatives";
  if (["hint", "hints", "solver", "tip", "tips", "strategy", "strategies", "cheat"].some((t) => toks.has(t))) return "solver-hints";
  if (["play", "free", "unlimited", "online", "unblocked", "infinite", "practice"].some((t) => toks.has(t))) return "play";
  return "navigational-name";
}

function mapping(keyword, brand, intent) {
  if (brand === "generic" && intent === "how-to") return { page: "/how-to-play", priority: "P1 — serve (generic)" };
  if (brand === "generic") return { page: "/", priority: "P1 — serve (generic)" };
  if (intent === "how-to") return { page: "/how-to-play", priority: "P2 — demand signal only (branded phrase, do not target)" };
  if (intent === "answers-archive") return { page: "—", priority: "Excluded — daily solutions/archives are not published" };
  if (intent === "alternatives") return { page: "—", priority: "Excluded — branded comparison, no page" };
  if (brand.startsWith("branded")) return { page: "—", priority: "Excluded — branded/trademark-sensitive, do not target" };
  return { page: "—", priority: "Excluded — typo/variant, no value" };
}

const rows = table.slice(1).map((cols) => {
  const [keyword, volume, organicTraffic, paidTraffic, avgPosition, locations, topLocation, topCode, topVolume, topTraffic] = cols;
  const brand = brandClass(keyword);
  const intent = intentOf(keyword);
  const map = mapping(keyword, brand, intent);
  return {
    keyword,
    volume: num(volume),
    organicTraffic: num(organicTraffic),
    paidTraffic: num(paidTraffic),
    avgPosition: num(avgPosition),
    locations: num(locations),
    topLocation,
    topLocationCode: topCode,
    topVolume: num(topVolume),
    topTraffic: num(topTraffic),
    brand,
    intent,
    page: map.page,
    priority: map.priority,
  };
});

const csvEscape = (v) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const outHeaders = [
  "Keyword",
  "Volume",
  "Organic traffic",
  "Paid traffic",
  "Average position",
  "Locations",
  "Top location",
  "Top location code",
  "Top location's volume",
  "Top location's traffic",
  "Brand class",
  "Intent",
  "Mapped page",
  "Priority/action",
];
const outLines = [outHeaders.join(",")];
for (const r of rows) {
  outLines.push(
    [
      r.keyword,
      r.volume,
      r.organicTraffic,
      r.paidTraffic,
      r.avgPosition,
      r.locations,
      r.topLocation,
      r.topLocationCode,
      r.topVolume,
      r.topTraffic,
      r.brand,
      r.intent,
      r.page,
      r.priority,
    ]
      .map(csvEscape)
      .join(","),
  );
}
writeFileSync(OUT, `${outLines.join("\n")}\n`);

const totalVolume = rows.reduce((a, r) => a + r.volume, 0);
const totalTraffic = rows.reduce((a, r) => a + r.organicTraffic, 0);
console.log(`Keywords: ${rows.length} distinct, ${new Set(rows.map((r) => r.keyword)).size} unique`);
console.log(`Total volume (as reported): ${totalVolume.toLocaleString()} | total organic traffic: ${totalTraffic.toLocaleString()} | paid traffic: ${rows.reduce((a, r) => a + r.paidTraffic, 0)}`);
for (const brand of ["branded-game-name", "branded-nyt", "branded-other (Letterboxd)", "branded-other (Wordle)", "typo/variant", "generic"]) {
  const g = rows.filter((r) => r.brand === brand);
  console.log(`${brand}: ${g.length} keywords, volume ${g.reduce((a, r) => a + r.volume, 0).toLocaleString()}, traffic ${g.reduce((a, r) => a + r.organicTraffic, 0).toLocaleString()}`);
}
for (const intent of ["navigational-name", "play", "how-to", "answers-archive", "alternatives", "solver-hints"]) {
  const g = rows.filter((r) => r.intent === intent);
  console.log(`Intent ${intent}: ${g.length} keywords, volume ${g.reduce((a, r) => a + r.volume, 0).toLocaleString()}`);
}
console.log(`Wrote ${OUT} (${rows.length} rows)`);
