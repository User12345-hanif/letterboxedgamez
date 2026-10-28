import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { SITE, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Letter Box Game: no accounts, no tracking, no advertising profiles. Your game progress stays in your own browser.",
  alternates: { canonical: canonical("/privacy-policy") },
  openGraph: {
    title: "Privacy Policy",
    description: "No accounts. No tracking. Your progress stays in your browser.",
    url: canonical("/privacy-policy"),
  },
};

export default function PrivacyPage() {
  return (
    <ArticleClient
      kicker="Privacy Policy"
      title="Privacy Policy"
      intro="Short version: Letter Box Game has no accounts and does not track you. Your game progress stays in your own browser. The rest of this page is the formal version of the same thing."
    >
      <p className="text-sm text-moss">Last updated: October 28, 2026.</p>

      <h2>What we collect</h2>
      <p>
        <strong>Nothing that identifies you.</strong> Letter Box Game does not ask for your name,
        email address, or any other personal information to play. We do not run analytics trackers,
        advertising trackers, or fingerprinting on this site.
      </p>

      <h2>What is stored in your browser</h2>
      <p>
        The game stores the following in your browser&apos;s local storage, on your device only:
      </p>
      <ul>
        <li>Your statistics (puzzles played and solved, streaks, words found, hints used).</li>
        <li>Your in-progress words for the current daily and practice puzzles, so a refresh resumes your game.</li>
      </ul>
      <p>
        This data is never sent to a server, never shared, and never sold. Clearing your
        browser&apos;s site data removes it. Private browsing and settings that clear storage on
        exit will also remove it.
      </p>

      <h2>Cookies</h2>
      <p>
        The game itself sets no cookies. The hosting platform may set strictly necessary,
        security-related cookies to serve the site; those are not used for tracking or advertising.
      </p>

      <h2>Sharing</h2>
      <p>
        The Share result button copies a summary of your solve to your clipboard. Nothing is
        shared automatically, and nothing is uploaded. What you do with the copied text is up to
        you.
      </p>

      <h2>Contact and changes</h2>
      <p>
        If this policy changes in a way that matters, the updated date above will change and the
        new version will be published on this page. Questions about privacy can be sent to{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ArticleClient>
  );
}
