"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sprinkles } from "./Decorations";
import { HowToPlayModal, StatsModal } from "./Modals";
import { loadStats, type Stats } from "@/lib/stats";
import { canonical, SITE } from "@/lib/site";

const RELATED = [
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
        <div className="relative overflow-hidden rounded-[32px] border-[3px] border-gold/40 bg-gradient-to-b from-butter/70 to-cream p-6 sm:p-8">
          <Sprinkles tone="ink" />
          <div className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-moss">
            <li>
              <Link href="/" className="font-semibold text-forest underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-pine">
              {title}
            </li>
          </ol>
        </nav>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-forest">{kicker}</p>
        <h1 className="mt-3 font-display text-[36px] font-bold leading-[1.08] tracking-tight text-ink sm:text-[44px]">
          {title}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-moss">{intro}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-pine [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:marker:text-forest [&_p]:leading-relaxed [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-forest [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>

        <section aria-labelledby="related-pages" className="mt-12 border-t border-line pt-8">
          <h2 id="related-pages" className="font-display text-[22px] font-bold text-ink">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.slice(0, 4).map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block h-full rounded-2xl border-2 border-line border-l-4 bg-cream p-4 shadow-sm transition hover:border-forest/40 ${["border-l-sky-deep", "border-l-mint-deep", "border-l-coral-deep", "border-l-lavender-deep"][i % 4]}`}
                >
                  <span className="block font-display text-[17px] font-bold text-ink">{item.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-moss">{item.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 rounded-3xl border-2 border-line bg-mint/70 p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold text-ink">Ready to play?</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-moss">
            Today&apos;s puzzle is waiting, and it takes only a few minutes. No account, no download.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-forest px-6 font-bold text-white transition hover:bg-forest-dark active:scale-[0.98]"
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
