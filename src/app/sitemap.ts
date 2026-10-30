import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PUZZLES } from "@/lib/puzzles";
import { puzzleDateKey } from "@/lib/daily";

const ROUTES = [
  "/",
  "/solver",
  "/unlimited",
  "/archive",
  "/daily",
  "/how-to-play",
  "/strategies",
  "/hints",
  "/faq",
  "/about",
  "/privacy-policy",
  "/terms",
] as const;

const GUIDES = [
  "/games-like-letter-boxed",
  "/letter-boxed-vs-connections",
  "/letter-boxed-vs-strands",
  "/two-word-solutions",
  "/rare-letters",
  "/suffixes-and-prefixes",
  "/bridge-words",
  "/8-letter-openers",
  "/common-mistakes",
  "/scoring-and-par",
  "/letter-boxed-vs-wordle",
  "/letter-boxed-vs-spelling-bee",
  "/history",
  "/word-list",
  "/letter-boxed-for-beginners",
] as const;

/** Daily pages for the last 28 days (the window in /daily). Older and
 *  future daily pages still render on demand via prev/next links;
 *  they are simply not listed here, to keep the sitemap bounded while
 *  the rotation repeats weekly. */
function recentDailyPaths(days = 28): string[] {
  const today = puzzleDateKey(new Date());
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const out: string[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    out.push(`/daily/${new Date(base - offset * 86_400_000).toISOString().slice(0, 10)}`);
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => {
    entries.push({
      url: `${SITE.url}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  };
  for (const path of ROUTES) add(path, path === "/" ? 1 : 0.9, path === "/" || path === "/daily" ? "daily" : "monthly");
  for (const path of GUIDES) add(path, 0.7, "monthly");
  for (const puzzle of PUZZLES) add(`/puzzles/${puzzle.id}`, 0.8, "monthly");
  for (const path of recentDailyPaths()) add(path, 0.8, "monthly");
  return entries;
}
