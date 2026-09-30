import { siteConfig } from "@/data/siteConfig";

export function organizationJsonLd(settings: typeof siteConfig = siteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "PhotographyStudio",
    name: settings.name,
    description: settings.seo.defaultDescription,
    url: settings.url,
    sameAs: [settings.instagram.url, ...(settings.youtube.url ? [settings.youtube.url] : [])],
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.location.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.location.structured.streetAddress,
            addressLocality: settings.location.structured.addressLocality,
            addressRegion: settings.location.structured.addressRegion,
            ...(settings.location.structured.postalCode ? { postalCode: settings.location.structured.postalCode } : {}),
            addressCountry: settings.location.structured.addressCountry,
          },
        }
      : {}),
  };
}

export function webSiteJsonLd(settings: typeof siteConfig = siteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: settings.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${settings.url}/portfolio?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
