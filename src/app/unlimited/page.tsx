import type { Metadata } from "next";
import UnlimitedClient from "@/components/UnlimitedClient";
import { canonical } from "@/lib/site";

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
};

export default function UnlimitedPage() {
  return <UnlimitedClient />;
}
