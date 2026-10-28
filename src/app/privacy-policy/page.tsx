import type { Metadata } from "next";
import { ArticleClient } from "@/components/ArticleClient";
import { SITE, canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Letter Box Game: no accounts, anonymous analytics only if you accept cookies. Your game progress stays in your own browser.",
  alternates: { canonical: canonical("/privacy-policy") },
  openGraph: {
    title: "Privacy Policy",
    description: "No accounts. Anonymous analytics only if you accept. Your progress stays in your browser.",
    url: canonical("/privacy-policy"),
  },
};

export default function PrivacyPage() {
  return (
    <ArticleClient
      kicker="Privacy Policy"
      title="Privacy Policy"
      intro="Short version: Letter Box Game has no accounts, and your game progress stays in your own browser. We use anonymous analytics only if you accept cookies for that purpose — you can reject, and you can change your choice at any time. The rest of this page is the formal version of the same thing."
    >
      <p className="text-sm text-moss">Last updated: October 29, 2026.</p>

      <h2>What we collect</h2>
      <p>
        <strong>Nothing that identifies you.</strong> Letter Box Game does not ask for your name,
        email address, or any other personal information to play. If you accept analytics
        cookies, Google Analytics 4 collects anonymous usage information — such as which pages
        are visited, how visitors arrive, and what kinds of devices are used — to help us
        understand, in aggregate, how the site is used. It never receives the words you type,
        your game statistics, or anything that identifies you. We do not run advertising
        trackers or fingerprinting, and we do not use advertising features, remarketing, or
        advertising personalization.
      </p>

      <h2>What is stored in your browser</h2>
      <p>
        The game stores the following in your browser&apos;s local storage, on your device only:
      </p>
      <ul>
        <li>Your statistics (puzzles played and solved, streaks, words found, hints used).</li>
        <li>Your in-progress words for the current daily and practice puzzles, so a refresh resumes your game.</li>
        <li>Your cookie choice (accepted or rejected), so the consent banner does not ask again.</li>
      </ul>
      <p>
        Your game progress and statistics are never sent to a server, never shared, and never
        sold. The only data that leaves your device is the anonymous analytics information
        described above, and only if you accepted analytics cookies. Clearing your
        browser&apos;s site data removes the stored data. Private browsing and settings that clear storage on
        exit will also remove it.
      </p>

      <h2>Cookies</h2>
      <p>
        The game itself sets no cookies. If you accept analytics cookies, Google Analytics sets
        cookies (such as <code>_ga</code>) that store an anonymous identifier so returning visits
        can be recognised in aggregate; those cookies are not used for advertising. If you
        reject, no analytics cookies are set and no analytics data is collected. Analytics
        storage stays disabled until you accept, and you can change your choice at any time
        using “Cookie choices” in the footer. The hosting platform may set strictly necessary,
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
