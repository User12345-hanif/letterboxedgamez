/**
 * Site configuration — the single editable source for branding,
 * canonical URLs and social metadata. Change values here and every
 * page, the sitemap and the sharing cards follow.
 */
export const SITE = {
  name: "Letter Box Game",
  shortName: "Letter Box",
  tagline: "Twelve letters. Four sides. One clear path.",
  description:
    "Letter Box Game is a free daily word puzzle. Use all twelve letters on four sides to build chained words — no two letters in a row from the same side. A new puzzle every day, plus unlimited practice puzzles.",
  /** Short description used for meta descriptions (kept under ~160 characters). */
  shortDescription:
    "Play a free letter-box word puzzle every day. Connect letters around the board, discover words, challenge yourself and enjoy unlimited practice puzzles.",
  url: "https://letterboxedgamez.com",
  domain: "letterboxedgamez.com",
  locale: "en_US",
  email: "hu397776@gmail.com",
  /**
   * Google Analytics 4 Measurement ID for the "Letter Box Game"
   * property (account 413903856, property 561327365). This is a
   * public identifier — it appears in the served page source — not
   * a secret. The tag only measures anything after the visitor
   * accepts analytics cookies; see src/lib/analytics.ts.
   */
  gaMeasurementId: "G-0E9NTNWGWY",
  /** Edit this list to add or remove pages from navigation, sitemap and footer. */
  nav: [
    { label: "Play", href: "/" },
    { label: "Solver", href: "/solver" },
    { label: "Unlimited", href: "/unlimited" },
    { label: "Archive", href: "/archive" },
    { label: "How to Play", href: "/how-to-play" },
    { label: "Strategies", href: "/strategies" },
    { label: "Hints", href: "/hints" },
    { label: "FAQ", href: "/faq" },
    { label: "About", href: "/about" },
  ] as const,
} as const;

export function canonical(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}`;
}

export function pageTitle(title?: string): string {
  return title
    ? `${title} | ${SITE.name}`
    : "Letter Boxed: Free Daily Word Puzzle & Practice";
}
