import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DailyHints from "@/components/DailyHints";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";
import { puzzleDateKey, puzzleForKarachiDate } from "@/lib/daily";
import { playableWords, puzzleToSides } from "@/lib/solver";

function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + days * 86_400_000).toISOString().slice(0, 10);
}

function recentDates(days = 60): string[] {
  const today = puzzleDateKey(new Date());
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const out: string[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    out.push(new Date(base - offset * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

export function generateStaticParams() {
  return recentDates(60).map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const puzzle = puzzleForKarachiDate(date);
  // Dates after today (Asia/Karachi) have no puzzle yet: they 404 (see
  // the page component below) instead of rendering a future board.
  if (!puzzle || date > puzzleDateKey(new Date())) {
    return { title: "Daily puzzle not found", robots: { index: false } };
  }
  return {
    title: `Letter Box puzzle for ${prettyDate(date)} — Hints and Solution`,
    description: `Hints and the checked solution for the Letter Box Game puzzle on ${prettyDate(date)}. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
    alternates: { canonical: canonical(`/daily/${date}`) },
    openGraph: {
      title: `Letter Box puzzle for ${prettyDate(date)} — Hints and Solution`,
      description: `Hints and the checked solution for the Letter Box Game puzzle on ${prettyDate(date)}. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
      url: canonical(`/daily/${date}`),
      // Same site image as the layout default: without this, a per-page
      // openGraph object replaces the layout one and the share image
      // (and the Twitter image derived from it) disappears.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Letter Box Game — twelve letters, four sides, one clear path." }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Letter Box puzzle for ${prettyDate(date)} — Hints and Solution`,
      description: `Hints and the checked solution for the Letter Box Game puzzle on ${prettyDate(date)}. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
    },
  };
}

const SIDE_NAMES = ["Top", "Right", "Bottom", "Left"];

export default async function DailyDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const puzzle = puzzleForKarachiDate(date);
  const today = puzzleDateKey(new Date());
  // Dates after today (Asia/Karachi) have no puzzle yet: 404 instead of
  // rendering a future board. All past dates keep rendering.
  if (!puzzle || date > today) notFound();
  const playable = playableWords(puzzleToSides(puzzle));
  const prev = shiftDate(date, -1);
  const next = shiftDate(date, 1);

  return (
    <ArticleClient
      kicker="Daily puzzle"
      title={`Letter Box puzzle — ${prettyDate(date)}`}
      intro={`${puzzle.label} · Par ${puzzle.solution.length} ${puzzle.solution.length === 1 ? "word" : "words"} · ${playable.length} legal words on this board in our word list. Daily puzzle changes at midnight Pakistan time. Try it yourself first — the hints below get stronger only when you ask for them.`}
    >
      <h2>The board</h2>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {puzzle.sides.map((side, i) => (
          <div key={i} className="rounded-2xl border-2 border-line bg-cream px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wider text-moss">{SIDE_NAMES[i]} side</dt>
            <dd className="mt-1 font-mono text-2xl font-bold tracking-[0.25em] text-ink">{side.join(" ")}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-moss">
        Rules in brief: words need at least 3 letters, no two consecutive letters from the same side, no repeated letter inside
        one word, and each new word starts with the last letter of the previous one. Use all 12 letters to solve it.
        <Link href="/how-to-play" className="ml-1 font-bold text-forest underline underline-offset-2">Full rules →</Link>
      </p>
      <p className="mt-3">
        <Link href="/" className="inline-block rounded-full bg-forest px-5 py-3 text-sm font-bold text-white">Play today&rsquo;s puzzle →</Link>
        {" "}
        <Link href={`/puzzles/${puzzle.id}`} className="inline-block rounded-full border-2 border-forest/25 bg-cream px-5 py-3 text-sm font-bold text-ink">This board&rsquo;s puzzle page →</Link>
      </p>
      <div className="mt-6">
        <DailyHints puzzle={puzzle} />
      </div>
      <nav aria-label="Other daily puzzles" className="mt-8 flex flex-wrap justify-between gap-3 text-sm">
        <Link href={`/daily/${prev}`} className="font-bold text-forest underline underline-offset-2">← {prettyDate(prev)}</Link>
        {next <= today && (
          <Link href={`/daily/${next}`} className="font-bold text-forest underline underline-offset-2">{prettyDate(next)} →</Link>
        )}
      </nav>
      <p className="mt-4 text-sm text-moss">
        This is our own original puzzle, not the New York Times puzzle. <Link href="/about" className="font-bold text-forest underline underline-offset-2">How our puzzles are made →</Link>
        {" · "}Want the full route for any board? <Link href="/solver" className="font-bold text-forest underline underline-offset-2">Use the solver →</Link>
      </p>
    </ArticleClient>
  );
}
