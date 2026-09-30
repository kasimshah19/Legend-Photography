"use client";

import Script from "next/script";

/**
 * Google Analytics 4 script loader.
 * Only renders when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Loads asynchronously — does NOT block LCP or initial render.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_title: document.title,
            send_page_view: true
          });
          window.gtag = gtag;
        `}
      </Script>
    </>
  );
}
