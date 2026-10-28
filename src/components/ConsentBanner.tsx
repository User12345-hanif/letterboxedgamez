"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_OPEN_EVENT,
  getStoredConsent,
  setConsentChoice,
  trackPageView,
  type ConsentChoice,
} from "@/lib/analytics";

/**
 * Cookie consent banner. It appears only when the visitor has not
 * stored a choice yet, or when they ask to change their choice
 * (the footer "Cookie choices" button dispatches CONSENT_OPEN_EVENT).
 * Accepting enables anonymous analytics; rejecting keeps analytics
 * storage disabled and collects nothing. The banner is a plain
 * page-level region, not a modal: it never traps focus or blocks
 * the puzzle, and it honours reduced-motion settings like the
 * rest of the site.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (getStoredConsent() === null) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const choose = useCallback(
    (choice: ConsentChoice) => {
      setConsentChoice(choice);
      setVisible(false);
      // The view the visitor is already on was never counted while
      // consent was undecided; count it now that they accepted.
      if (choice === "accepted") trackPageView(pathname);
    },
    [pathname],
  );

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-5"
    >
      <div className="mx-auto max-w-3xl rounded-[24px] border-2 border-gold/60 bg-cream p-5 shadow-lift">
        <h2 className="font-display text-lg font-bold text-ink">Your privacy, your choice</h2>
        <p className="mt-1 text-sm leading-relaxed text-pine">
          We use Google Analytics to understand, in aggregate, how the site is used — which
          pages are visited and what kinds of devices people play on. It never receives the
          words you type or anything that identifies you, and we use no advertising features.
          Analytics cookies are set only if you accept; if you reject, no analytics data is
          collected. See the{" "}
          <Link
            href="/privacy-policy"
            className="font-semibold text-forest underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose("accepted")}
            aria-label="Accept analytics"
            className="min-h-11 cursor-pointer rounded-full bg-gradient-to-b from-forest-light to-forest px-5 text-sm font-bold text-white shadow-sm transition hover:from-forest hover:to-forest-dark active:scale-[0.98]"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => choose("rejected")}
            aria-label="Reject analytics"
            className="min-h-11 cursor-pointer rounded-full border-2 border-forest bg-cream px-5 text-sm font-bold text-forest-dark transition hover:bg-gold-light active:scale-[0.98]"
          >
            Reject
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-moss">
          You can change your choice at any time using “Cookie choices” in the footer.
        </p>
      </div>
    </div>
  );
}
