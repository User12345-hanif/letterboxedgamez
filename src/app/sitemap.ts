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

/** Daily pages for the last 28 days (the window in /daily). Older daily
 *  pages still render on demand via prev links; future daily pages
 *  return 404 (see daily/[date]/page.tsx) and are never listed here,
 *  to keep the sitemap bounded while the rotation repeats weekly. */
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

/** Last meaningful content change per static route, as a plain date.
 *  Sources: the last git commit touching that route's page file, except
 *  routes whose body content changed in the 2026-10-31 SEO
 *  implementation (marked 2026-10-31). Head-metadata-only changes
 *  (e.g. Twitter cards) and shared chrome changes (header/footer nav)
 *  do NOT count as content changes and do not move a date.
 *  RULE FOR FUTURE EDITS: when a page's body content changes, update
 *  its entry here in the same change — never stamp the build date.
 *  Daily pages use a first-valid rule, not their puzzle date as a
 *  modification date (see dailyLastModified below). */
const CONTENT_DATES: Record<string, string> = {
  "/": "2026-10-31",
  "/solver": "2026-10-30",
  "/unlimited": "2026-10-31",
  "/archive": "2026-10-30",
  "/daily": "2026-10-30",
  "/how-to-play": "2026-10-29",
  "/strategies": "2026-10-29",
  "/hints": "2026-10-29",
  "/faq": "2026-10-29",
  "/about": "2026-10-29",
  "/privacy-policy": "2026-10-29",
  "/terms": "2026-10-29",
  "/games-like-letter-boxed": "2026-10-30",
  "/letter-boxed-vs-connections": "2026-10-30",
  "/letter-boxed-vs-strands": "2026-10-30",
  "/two-word-solutions": "2026-10-31",
  "/rare-letters": "2026-10-30",
  "/suffixes-and-prefixes": "2026-10-31",
  "/bridge-words": "2026-10-30",
  "/8-letter-openers": "2026-10-31",
  "/common-mistakes": "2026-10-31",
  "/scoring-and-par": "2026-10-30",
  "/letter-boxed-vs-wordle": "2026-10-31",
  "/letter-boxed-vs-spelling-bee": "2026-10-31",
  "/history": "2026-10-31",
  "/word-list": "2026-10-30",
  "/letter-boxed-for-beginners": "2026-10-31",
};

/** Puzzle pages changed in the 2026-10-31 SEO implementation (date-list
 *  cap, practice deep link, intro text), so they share that date. */
const PUZZLE_DATE = "2026-10-31";

/** Daily pages: lastModified is the first date the URL was a valid
 *  daily page, unless its content was meaningfully modified later.
 *  There is no per-date file, so no per-date modification date exists
 *  on its own; daily pages are generated from one board-data file and
 *  one page template.
 *  EVIDENCE for the baseline: the daily route was ADDED in commit
 *  3a10e91, 2026-10-30 19:55 PKT (+0500), and is absent from the
 *  pre-merge main tree; live verification 2026-10-30 ~19:57 PKT found
 *  /daily/2026-10-30 live and a sitemap with 28 daily entries; the
 *  live sitemap at 2026-10-31 07:19 PKT listed daily dates
 *  2026-10-03 to 2026-10-30 (28), not 2026-10-31. Board data in
 *  src/lib/puzzles.ts last changed 2026-10-28 (initial commit
 *  c5d229f, untouched since); the daily template, daily logic and
 *  hints last changed 2026-10-30 (commit 3a10e91). Both the
 *  first-served date and the last content-change date are therefore
 *  2026-10-30 today — they coincide, they are not assumed.
 *  RULE: lastmod = max(first-valid date, last content-change date).
 *  First-valid date = max(puzzle date, 2026-10-30): dates
 *  2026-10-04 to 2026-10-30 were already past or today when first
 *  served on 2026-10-30, so they take 2026-10-30; 2026-10-31 first
 *  becomes valid on 2026-10-31, because under the future-404 rule a
 *  date after Karachi today 404s (daily/[date]/page.tsx), so on
 *  2026-10-30 it would have 404d and on 2026-10-31 it renders as
 *  today. NOTE on the old live code: before this branch, future
 *  boards were preview-renderable, so 2026-10-31 was renderable on
 *  2026-10-30 as a future board — but it was not a valid daily page
 *  (today's puzzle) and was not in the live sitemap then; the adopted
 *  definition is first date it is a valid daily page, not first date
 *  it was preview-renderable.
 *  FUTURE pages: a date D first becomes valid on D itself (when D
 *  becomes Karachi today), so its lastmod is D, unless board or
 *  template content is meaningfully modified later — then update
 *  DAILY_CONTENT_DATE to that later date and the max() picks it up.
 *  Head-metadata-only changes (Twitter/Open Graph cards) do not move
 *  either date. This is NOT automated freshness: both baselines are
 *  fixed strings, and a future page's lastmod is its own first-valid
 *  date, never the build date. The sitemap itself is still
 *  build-time, so a new daily page may first be LISTED on a later
 *  deploy while its lastmod remains its first-valid date. */
const DAILY_FIRST_SERVED = "2026-10-30";
const DAILY_CONTENT_DATE = "2026-10-30";

function dailyLastModified(dateIso: string): string {
  // ISO dates (YYYY-MM-DD) compare lexicographically in date order.
  let latest = DAILY_FIRST_SERVED;
  if (DAILY_CONTENT_DATE > latest) latest = DAILY_CONTENT_DATE;
  if (dateIso > latest) latest = dateIso;
  return latest;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const add = (
    path: string,
    lastModified: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => {
    entries.push({
      url: `${SITE.url}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency,
      priority,
    });
  };
  for (const path of ROUTES) add(path, CONTENT_DATES[path], path === "/" ? 1 : 0.9, path === "/" || path === "/daily" ? "daily" : "monthly");
  for (const path of GUIDES) add(path, CONTENT_DATES[path], 0.7, "monthly");
  for (const puzzle of PUZZLES) add(`/puzzles/${puzzle.id}`, PUZZLE_DATE, 0.8, "monthly");
  for (const path of recentDailyPaths()) add(path, dailyLastModified(path.slice("/daily/".length)), 0.8, "monthly");
  return entries;
}
