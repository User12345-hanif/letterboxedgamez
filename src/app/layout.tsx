import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { canonical, SITE } from "@/lib/site";
import { ConsentBanner } from "@/components/ConsentBanner";
import { GoogleTag, PageViewTracker } from "@/components/GoogleTag";
import "./globals.css";

// Self-hosted fonts (latin variable files, OFL-licensed Fredoka and Nunito).
// The files are committed as base64 text (`*.woff2.b64`) and decoded to
// `.woff2` by scripts/prepare-fonts.mjs via the prebuild/predev hooks,
// because the GitHub snapshot push rejects binary files. The build must
// not depend on fetching and parsing live Google Fonts CSS: on Vercel
// that fetch produced a response `next/font/google` could not parse,
// crashing the build with "TypeError: Cannot read properties of null
// (reading '1')" in its loader. These are the same variable files the
// Google Fonts build emits, so the rendered typography is unchanged.
const display = localFont({
  src: [
    { path: "./fonts/display-latin.woff2", weight: "500", style: "normal" },
    { path: "./fonts/display-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/display-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "./fonts/sans-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/sans-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/sans-latin.woff2", weight: "700", style: "normal" },
    { path: "./fonts/sans-latin.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Letter Boxed: Free Daily Word Puzzle & Practice",
    template: "%s | Letter Box Game",
  },
  description: SITE.shortDescription,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: canonical("/") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Letter Boxed: Free Daily Word Puzzle & Practice",
    description: SITE.shortDescription,
    url: canonical("/"),
    locale: SITE.locale,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Letter Box Game — twelve letters, four sides, one clear path." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Letter Boxed: Free Daily Word Puzzle & Practice",
    description: SITE.shortDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Games",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    description: SITE.description,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Skip to the puzzle
        </a>
        {children}
        <GoogleTag />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <ConsentBanner />
      </body>
    </html>
  );
}
