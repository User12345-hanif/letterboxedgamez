import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DailyHints from "@/components/DailyHints";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";
import { PUZZLES } from "@/lib/puzzles";
import { datesForPuzzle, puzzleDateKey } from "@/lib/daily";
import { playableWords, puzzleToSides } from "@/lib/solver";

export function generateStaticParams() {
  return PUZZLES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const puzzle = PUZZLES.find((p) => p.id === id);
  if (!puzzle) return { title: "Puzzle not found", robots: { index: false } };
  return {
    title: `${puzzle.label} — Hints and Solution`,
    description: `Hints and the checked solution for ${puzzle.label} in Letter Box Game. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
    alternates: { canonical: canonical(`/puzzles/${id}`) },
    openGraph: {
      title: `${puzzle.label} — Hints and Solution`,
      description: `Hints and the checked solution for ${puzzle.label} in Letter Box Game. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
      url: canonical(`/puzzles/${id}`),
      // Same site image as the layout default: without this, a per-page
      // openGraph object replaces the layout one and the share image
      // (and the Twitter image derived from it) disappears.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Letter Box Game — twelve letters, four sides, one clear path." }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${puzzle.label} — Hints and Solution`,
      description: `Hints and the checked solution for ${puzzle.label} in Letter Box Game. Board letters by side, par ${puzzle.solution.length}, tiered hints and a letter-by-letter reveal.`,
    },
  };
}

const SIDE_NAMES = ["Top", "Right", "Bottom", "Left"];

export default async function PuzzlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puzzle = PUZZLES.find((p) => p.id === id);
  if (!puzzle) notFound();
  const playable = playableWords(puzzleToSides(puzzle));
  const dates = datesForPuzzle(puzzle.id, 14, 0);
  const today = puzzleDateKey(new Date());

  return (
    <ArticleClient
      kicker="Puzzle"
      title={`${puzzle.label} — hints and solution`}
      intro={`${puzzle.hint} Par ${puzzle.solution.length} ${puzzle.solution.length === 1 ? "word" : "words"} · ${playable.length} legal words on this board in our word list. Try it yourself first — the hints below get stronger only when you ask for them.`}
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
        <Link href={`/unlimited?board=${puzzle.id}`} className="inline-block rounded-full border-2 border-forest/25 bg-cream px-5 py-3 text-sm font-bold text-ink">Practise this board →</Link>
      </p>
      <div className="mt-6">
        <DailyHints puzzle={puzzle} />
      </div>
      <h2>Dates this puzzle appears</h2>
      <p>
        The daily puzzle cycles through seven boards, so this board returns every week. Recent dates for it:
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {dates.map((iso) => (
          <li key={iso} className="rounded-2xl border-2 border-line bg-cream px-4 py-2 text-sm">
            <Link href={`/daily/${iso}`} className="font-bold text-forest hover:underline">{iso}</Link>
            {iso === today && <span className="ml-2 text-xs font-bold uppercase tracking-wide text-moss">· today</span>}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-moss">
        This is our own original puzzle, not the New York Times puzzle. <Link href="/about" className="font-bold text-forest underline underline-offset-2">How our puzzles are made →</Link>
        {" · "}Want the full route for any board? <Link href="/solver" className="font-bold text-forest underline underline-offset-2">Use the solver →</Link>
      </p>
    </ArticleClient>
  );
}
