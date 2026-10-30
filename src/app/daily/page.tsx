import type { Metadata } from "next";
import Link from "next/link";
import { ArticleClient } from "@/components/ArticleClient";
import { canonical } from "@/lib/site";
import { puzzleDateKey, puzzleForKarachiDate } from "@/lib/daily";

export const metadata: Metadata = {
  title: "Daily Letter Box Puzzles by Date",
  description:
    "Find the Letter Box Game puzzle for any date, with its board, par, tiered hints and checked solution. The daily puzzle changes at midnight Pakistan time.",
  alternates: { canonical: canonical("/daily") },
};

function recentDates(days = 28): string[] {
  const today = puzzleDateKey(new Date());
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const out: string[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    out.push(new Date(base - offset * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

export default function DailyIndexPage() {
  const dates = recentDates(28);
  return (
    <ArticleClient
      kicker="Daily puzzles"
      title="Daily puzzles by date"
      intro="The daily puzzle changes at midnight Pakistan time and cycles through seven boards, so each board returns every week. Pick a date for that day's board, tiered hints and checked solution — or browse the seven boards themselves in the archive."
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {dates.map((iso) => {
          const puzzle = puzzleForKarachiDate(iso);
          if (!puzzle) return null;
          return (
            <li key={iso} className="rounded-2xl border-2 border-line bg-cream px-4 py-3">
              <Link href={`/daily/${iso}`} className="font-bold text-forest hover:underline">
                {iso}
              </Link>
              <span className="text-sm text-moss"> — {puzzle.label} · Par {puzzle.solution.length}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm text-moss">
        <Link href="/archive" className="font-bold text-forest underline underline-offset-2">Browse all seven boards →</Link>
        {" · "}
        <Link href="/solver" className="font-bold text-forest underline underline-offset-2">Solve any board →</Link>
      </p>
    </ArticleClient>
  );
}
