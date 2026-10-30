import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";
import { PUZZLES } from "@/lib/puzzles";

export const metadata: Metadata = {
  title: "Letter Box Puzzle Archive",
  description:
    "Browse all Letter Box Game puzzles in the rotation. Every board shows its letters by side and its par — hints and the checked solution are on each puzzle page.",
  alternates: { canonical: canonical("/archive") },
  openGraph: {
    title: "Letter Box Puzzle Archive",
    description: "All seven puzzles in the Letter Box Game rotation, with boards, par and hints.",
    url: canonical("/archive"),
  },
};

const SIDE_NAMES = ["Top", "Right", "Bottom", "Left"];

export default function ArchivePage() {
  return (
    <ArticleClient
      kicker="Archive"
      title="Puzzle archive"
      intro="All seven puzzles in the rotation, newest first by label. The daily puzzle cycles through these seven boards, so each one returns every week. Solutions are not listed here, so you can still play a board without being spoiled — open a puzzle for its tiered hints and, when you want it, its checked solution."
    >
      <ol className="space-y-4">
        {PUZZLES.map((p) => (
          <li key={p.id} className="rounded-3xl border-2 border-line bg-cream p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  <Link href={`/puzzles/${p.id}`} className="hover:underline">{p.label}</Link>
                </h2>
                <p className="mt-1 text-sm text-moss">Par {p.solution.length} {p.solution.length === 1 ? "word" : "words"} · {p.hint}</p>
              </div>
              <Link href={`/puzzles/${p.id}`} className="rounded-full bg-forest px-4 py-2.5 text-sm font-bold text-white">
                Hints &amp; solution →
              </Link>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {p.sides.map((side, i) => (
                <div key={i} className="rounded-2xl bg-white px-3 py-2">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-moss">{SIDE_NAMES[i]}</dt>
                  <dd className="mt-0.5 font-mono text-base font-bold tracking-[0.25em] text-ink">{side.join(" ")}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-moss">
        Want a board for a specific date? <Link href="/daily" className="font-bold text-forest underline underline-offset-2">Daily pages by date →</Link>
        {" · "}Stuck on a board? <Link href="/solver" className="font-bold text-forest underline underline-offset-2">Try the solver →</Link>
      </p>
    </ArticleClient>
  );
}
