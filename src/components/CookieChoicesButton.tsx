"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/analytics";

/** Footer control that re-opens the cookie consent banner. */
export function CookieChoicesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-cream/90 underline-offset-4 transition hover:bg-white/10 hover:text-gold-light hover:underline"
    >
      <span aria-hidden="true" className="text-[10px] leading-none text-gold">
        ✦
      </span>
      Cookie choices
    </button>
  );
}
