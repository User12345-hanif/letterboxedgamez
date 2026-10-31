import type { Metadata } from "next";
import UnlimitedClient from "@/components/UnlimitedClient";
import { canonical } from "@/lib/site";
import { PUZZLES } from "@/lib/puzzles";
import { todayPuzzle } from "@/lib/daily";

export const metadata: Metadata = {
  title: "Unlimited Letter Box Practice Puzzles",
  description:
    "Play unlimited Letter Box practice puzzles for free — every board is verified, has a par, and uses the same rules as the daily puzzle. No account needed.",
  alternates: { canonical: canonical("/unlimited") },
  openGraph: {
    title: "Unlimited Letter Box Practice Puzzles",
    description: "More than one board a day: verified practice puzzles, free, no account.",
    url: canonical("/unlimited"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlimited Letter Box Practice Puzzles",
    description: "More than one board a day: verified practice puzzles, free, no account.",
  },
};

/** Offset from today's daily board to the requested board, using the
 *  same formula as GameScreen's board picker (an offset of 0 maps to a
 *  full rotation so the board still loads in practice mode). Unknown
 *  or missing ids fall back to the default offset of 1. */
function boardOffset(boardId: string | undefined): number {
  if (!boardId) return 1;
  const target = PUZZLES.findIndex((p) => p.id === boardId);
  if (target < 0) return 1;
  const daily = PUZZLES.indexOf(todayPuzzle());
  return ((target - daily) % PUZZLES.length + PUZZLES.length) % PUZZLES.length || PUZZLES.length;
}

export default async function UnlimitedPage({ searchParams }: { searchParams: Promise<{ board?: string }> }) {
  const { board } = await searchParams;
  return <UnlimitedClient initialPracticeOffset={boardOffset(board)} />;
}
