/**
 * Site configuration — the single editable source for branding,
 * canonical URLs and social metadata. Change values here and every
 * page, the sitemap and the sharing cards follow.
 */
export const SITE = {
  name: "Letterboxed Gamez",
  shortName: "Letterboxed",
  tagline: "Twelve letters. Four sides. One clear path.",
  description:
    "Letterboxed Gamez is a free daily word puzzle. Use all twelve letters on four sides to build chained words — no two letters in a row from the same side. A new puzzle every day, plus unlimited practice puzzles.",
  /** Short description used for meta descriptions (kept under ~160 characters). */
  shortDescription:
    "Play Letterboxed Gamez, a free daily word puzzle. Chain words around four sides and use all twelve letters — no account needed.",
  url: "https://letterboxedgamez.com",
  domain: "letterboxedgamez.com",
  locale: "en_US",
  email: "hello@letterboxedgamez.com",
  /** Edit this list to add or remove pages from navigation, sitemap and footer. */
  nav: [
    { label: "Play", href: "/" },
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
    : "Free Letter Box Word Game – Daily Puzzle | Letterboxed Gamez";
}
