"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HowToPlayModal, StatsModal } from "./Modals";
import { loadStats, type Stats } from "@/lib/stats";
import { canonical, SITE } from "@/lib/site";

const RELATED = [
  { label: "Solver", href: "/solver", blurb: "Solve any 12-letter board, shortest chain first." },
  { label: "Games like Letter Boxed", href: "/games-like-letter-boxed", blurb: "Related games, compared honestly, with links back to Letter Box." },
  { label: "Unlimited", href: "/unlimited", blurb: "More than one board a day, free, no account." },
  { label: "Archive", href: "/archive", blurb: "All seven boards in the rotation, with hints." },
  { label: "How to Play", href: "/how-to-play", blurb: "The complete rules, with examples and keyboard controls." },
  { label: "Strategies", href: "/strategies", blurb: "Plan a two-word solve without guessing." },
  { label: "Hints", href: "/hints", blurb: "Spoiler-free ways to get unstuck, and how hints work." },
  { label: "FAQ", href: "/faq", blurb: "Is it free? Why was my word rejected? Straight answers." },
  { label: "About", href: "/about", blurb: "How the puzzles are made and verified." },
] as const;

export function ArticleClient({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const pathname = usePathname() ?? "/";
  const related = RELATED.filter((item) => item.href !== pathname);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: title, item: canonical(pathname) },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header
        onHowToPlay={() => setShowHowTo(true)}
        onStatistics={() => {
          setStats(loadStats());
          setShowStats(true);
        }}
        solvedCount={stats.gamesSolved}
      />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 sm:px-6">
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-900 p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)] sm:p-8">
          <div className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
            <li>
              <Link href="/" className="font-semibold text-emerald-400 underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-slate-300">
              {title}
            </li>
          </ol>
        </nav>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">{kicker}</p>
        <h1 className="mt-3 font-display text-[36px] font-bold leading-[1.08] tracking-tight text-white sm:text-[44px]">
          {title}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-slate-400">{intro}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-slate-300 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-white [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:marker:text-emerald-400 [&_p]:leading-relaxed [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-emerald-400 [&_a]:font-semibold [&_a]:text-emerald-400 [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>

        <section aria-labelledby="related-pages" className="mt-12 border-t border-slate-700/70 pt-8">
          <h2 id="related-pages" className="font-display text-[22px] font-bold text-white">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.slice(0, 4).map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-2xl border border-slate-700/70 border-l-4 border-l-emerald-600 bg-slate-900 p-4 transition hover:border-emerald-600/40"
                >
                  <span className="block font-display text-[17px] font-bold text-white">{item.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">{item.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-900 p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]">
          <h2 className="font-display text-xl font-bold text-white">Ready to play?</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-400">
            Today&apos;s puzzle is waiting, and it takes only a few minutes. No account, no download.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-emerald-600 px-6 font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Play today&apos;s puzzle →
          </Link>
        </div>
      </main>
      <Footer />
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  );
}
