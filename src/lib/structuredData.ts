import { siteConfig } from "@/data/siteConfig";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PhotographyStudio",
    name: siteConfig.name,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.url,
    sameAs: [siteConfig.instagram.url, ...(siteConfig.youtube.url ? [siteConfig.youtube.url] : [])],
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.location.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.location.structured.streetAddress,
            addressLocality: siteConfig.location.structured.addressLocality,
            addressRegion: siteConfig.location.structured.addressRegion,
            addressCountry: siteConfig.location.structured.addressCountry,
          },
        }
      : {}),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/portfolio?q={search_term_string}`,
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
