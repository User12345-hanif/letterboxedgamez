import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { canonical, SITE } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Letterboxed Gamez — Daily Word Puzzle",
    template: "%s | Letterboxed Gamez",
  },
  description: SITE.shortDescription,
  keywords: [
    "daily word puzzle",
    "letter puzzle",
    "word game",
    "letterboxed",
    "word chain puzzle",
    "free word game",
    "daily puzzle game",
  ],
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
    title: "Letterboxed Gamez — Daily Word Puzzle",
    description: SITE.shortDescription,
    url: canonical("/"),
    locale: SITE.locale,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Letterboxed Gamez — twelve letters, four sides, one clear path." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Letterboxed Gamez — Daily Word Puzzle",
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
      </body>
    </html>
  );
}
