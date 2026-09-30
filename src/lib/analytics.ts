/**
 * Analytics event tracking utility for Legend Photography.
 * Sends events to Google Analytics 4 (gtag.js) when configured.
 * 
 * PRIVACY: Never sends PII (names, emails, phone numbers, messages).
 * Only tracks interaction type and non-PII context.
 */

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

function sendEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// ─── Business Conversion Events ────────────────────────────────

/** Fire AFTER server confirms successful contact form submission */
export function trackContactFormSubmit(service: string) {
  sendEvent("contact_form_submit", {
    event_category: "conversion",
    service_type: service, // e.g. "Wedding", "Pre-Wedding" — no PII
  });
}

/** WhatsApp CTA click */
export function trackWhatsAppClick(location: string) {
  sendEvent("whatsapp_click", {
    event_category: "contact",
    click_location: location, // e.g. "footer", "floating", "cta"
  });
}

/** Phone link click */
export function trackPhoneClick(location: string) {
  sendEvent("phone_click", {
    event_category: "contact",
    click_location: location,
  });
}

/** Email link click */
export function trackEmailClick(location: string) {
  sendEvent("email_click", {
    event_category: "contact",
    click_location: location,
  });
}

// ─── Content Engagement Events ─────────────────────────────────

/** Portfolio album page view */
export function trackPortfolioAlbumView(albumSlug: string, category: string) {
  sendEvent("portfolio_album_view", {
    event_category: "engagement",
    album_slug: albumSlug,
    album_category: category,
  });
}

/** Portfolio CTA click (e.g. "Book similar shoot") */
export function trackPortfolioCTAClick(albumSlug: string) {
  sendEvent("portfolio_cta_click", {
    event_category: "conversion",
    album_slug: albumSlug,
  });
}

/** Film video click */
export function trackFilmClick(filmTitle: string) {
  sendEvent("film_click", {
    event_category: "engagement",
    film_title: filmTitle,
  });
}

/** Service CTA click */
export function trackServiceCTAClick(serviceName: string) {
  sendEvent("service_cta_click", {
    event_category: "conversion",
    service_name: serviceName,
  });
}
