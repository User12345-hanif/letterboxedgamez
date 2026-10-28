"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_STORAGE_KEY, trackPageView } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/**
 * The Google tag (gtag.js), loaded with Google Consent Mode defaults
 * denied for every storage type. The inline bootstrap runs before
 * the tag configures itself: consent starts denied, is lifted to
 * granted only when a stored "accepted" choice exists, and the
 * config disables automatic page views — the site sends exactly
 * one page_view per navigation itself (see PageViewTracker).
 * Advertising signals are disabled in the config as well as in
 * the GA4 property (Google signals off, enhanced measurement off).
 */
export function GoogleTag() {
  const measurementId = SITE.gaMeasurementId;
  if (!measurementId) return null;

  const bootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
try {
  if (window.localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted') {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }
} catch (e) {}
var gaDebug = false;
try { gaDebug = new URLSearchParams(window.location.search).get('ga_debug') === '1'; } catch (e) {}
gtag('js', new Date());
gtag('config', '${measurementId}', {
  'send_page_view': false,
  'debug_mode': gaDebug,
  'allow_google_signals': false,
  'allow_ad_personalization_signals': false
});
`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-consent-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
    </>
  );
}

/**
 * Sends one page_view per navigation (initial load included).
 * Render inside a Suspense boundary: useSearchParams requires one.
 * Events are gated on consent inside trackPageView.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
