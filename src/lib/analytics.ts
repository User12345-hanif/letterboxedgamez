/**
 * Privacy-conscious Google Analytics 4 helper.
 *
 * Rules this module enforces, whatever calls it:
 * - The gtag consent defaults are "denied" for every storage type
 *   (set by the inline bootstrap in GoogleTag, before the tag loads).
 * - No event and no page view is sent unless the visitor has stored
 *   an "accepted" consent choice. Rejecting (or never choosing)
 *   means nothing is measured — the tag itself stays in its denied
 *   mode and sets no analytics cookies.
 * - Event payloads carry only the puzzle mode, the puzzle id, and
 *   counts. The puzzle id is the puzzle's public identifier (it ships
 *   in the page bundle) — never anything the visitor typed. Payloads
 *   never contain typed words, personal information, or any other
 *   identifier.
 * - Analytics must never break the game: every call is guarded and
 *   failures are swallowed.
 */

export type ConsentChoice = "accepted" | "rejected";

export const CONSENT_STORAGE_KEY = "letterboxed-gamez:consent:v1";

/** Dispatched when the visitor asks to revisit their cookie choice. */
export const CONSENT_OPEN_EVENT = "letterboxed-gamez:open-consent";

/** Dispatched when the visitor accepts analytics (so live UI can report current state). */
export const CONSENT_GRANTED_EVENT = "letterboxed-gamez:consent-granted";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

/** `?ga_debug=1` routes events to GA4 DebugView for verification. */
export function isDebugMode(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("ga_debug") === "1";
  } catch {
    return false;
  }
}

function updateGtagConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("consent", "update", {
      analytics_storage: choice === "accepted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  } catch {
    // Analytics must never break the game.
  }
}

/** Persist the visitor's choice and apply it to Google Consent Mode. */
export function setConsentChoice(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Private browsing etc: the choice simply won't persist.
  }
  if (choice === "rejected") clearAnalyticsCookies();
  updateGtagConsent(choice);
  if (choice === "accepted") {
    try {
      window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
    } catch {
      // Listeners are optional; the stored choice is the source of truth.
    }
  }
}

/**
 * Rejecting must leave no analytics cookies behind: consent mode
 * stops future writes, but cookies set during an earlier accepted
 * period would otherwise linger in the browser.
 */
function clearAnalyticsCookies(): void {
  try {
    const names = document.cookie
      .split(";")
      .map((part) => part.split("=")[0].trim())
      .filter((name) => name.startsWith("_ga") || name.startsWith("_gid") || name.startsWith("_gat"));
    const hostParts = window.location.hostname.split(".");
    const domain = hostParts.length > 1 ? `.${hostParts.slice(-2).join(".")}` : "";
    for (const name of names) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      if (domain) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
    }
  } catch {
    // Cookie removal is best-effort; consent mode already blocks writes.
  }
}

type EventParams = Record<string, string | number | boolean>;

/** Send one GA4 event — only after the visitor accepted analytics. Returns whether it was sent. */
export function trackEvent(name: string, params: EventParams = {}): boolean {
  if (typeof window === "undefined") return false;
  if (getStoredConsent() !== "accepted") return false;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return false;
  try {
    gtag("event", name, { ...params, debug_mode: isDebugMode() });
    return true;
  } catch {
    // Analytics must never break the game.
    return false;
  }
}

/** One manual page view per navigation; the tag's automatic page views are off. */
export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (getStoredConsent() !== "accepted") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      debug_mode: isDebugMode(),
    });
  } catch {
    // Analytics must never break the game.
  }
}

export function trackPuzzleActivated(mode: "daily" | "practice", puzzleId: string): boolean {
  if (mode === "practice") {
    return trackEvent("practice_puzzle_started", { mode, puzzle_id: puzzleId });
  }
  return trackEvent("puzzle_started", { mode, puzzle_id: puzzleId });
}

export function trackWordSubmitted(
  mode: "daily" | "practice",
  puzzleId: string,
  wordLength: number,
  wordsFound: number,
): void {
  trackEvent("word_submitted", {
    mode,
    puzzle_id: puzzleId,
    word_length: wordLength,
    words_found: wordsFound,
  });
}

export function trackPuzzleCompleted(
  mode: "daily" | "practice",
  puzzleId: string,
  wordsUsed: number,
  hintsUsed: number,
  solveSeconds: number,
): void {
  trackEvent("puzzle_completed", {
    mode,
    puzzle_id: puzzleId,
    words_used: wordsUsed,
    hints_used: hintsUsed,
    solve_seconds: solveSeconds,
  });
}

export function trackHintUsed(
  mode: "daily" | "practice",
  puzzleId: string,
  hintsUsed: number,
): void {
  trackEvent("hint_used", { mode, puzzle_id: puzzleId, hints_used: hintsUsed });
}
