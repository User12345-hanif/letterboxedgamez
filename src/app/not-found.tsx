import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="font-display text-6xl font-bold text-forest">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink">That page is off the board</h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-moss">
        The page you asked for does not exist. Today&apos;s puzzle is still waiting, though.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 font-bold text-white hover:bg-forest-dark"
      >
        Back to today&apos;s puzzle →
      </Link>
    </main>
  );
}
