export const siteConfig = {
  name: "Legend Photography",
  legalName: "Legend Photography",
  tagline: "Stories That Deserve To Be Remembered.",
  description:
    "Legend Photography is a premium photography studio specializing in authentic wedding, pre-wedding, candid, maternity, portrait, and event photography.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  instagram: {
    handle: "legend__photography_",
    url: "https://www.instagram.com/legend__photography_/",
  },
  
  youtube: {
    url: normalizeYoutubeUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL ?? ""),
  },

  /** Set in .env — leave empty until verified */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",

  location: {
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
    formattedAddress: [
      "Jayhind Colony Road,",
      "Shree Mangal Harchand Nagar,",
      "Vikharan, Dondaicha,",
      "Maharashtra 425408,",
      "District Dhule, Maharashtra, India"
    ],
    structured: {
      streetAddress: "Jayhind Colony Road, Shree Mangal Harchand Nagar, Vikharan",
      addressLocality: "Dondaicha",
      addressRegion: "Maharashtra",
      postalCode: "425408",
      addressCountry: "IN",
    },
    mapQuery: "Jayhind Colony Road, Shree Mangal Harchand Nagar, Vikharan, Dondaicha, Maharashtra 425408, District Dhule, Maharashtra, India",
    googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ?? "",
  },

  navigation: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ] as const,

  primaryCta: { label: "Book a Shoot", href: "/contact" },
  secondaryCta: { label: "View Portfolio", href: "/portfolio" },
  
  seo: {
    defaultTitle: "Legend Photography | Premium Wedding & Pre-Wedding Photography",
    titleTemplate: "%s | Legend Photography",
    defaultDescription: "Legend Photography is a premium photography studio specializing in authentic wedding, pre-wedding, candid, maternity, portrait, and event photography.",
    defaultOgImage: "/images/hero/indian-wedding-hero.jpg",
  }
} as const;

export function whatsappUrl(message?: string): string | null {
  let digits = siteConfig.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("910") && digits.length > 11) digits = "91" + digits.slice(3);
  digits = digits.startsWith("91") ? digits : `91${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function telUrl(): string | null {
  let digits = siteConfig.phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("910") && digits.length > 11) digits = "91" + digits.slice(3);
  return `tel:+${digits.startsWith("91") ? digits : `91${digits}`}`;
}

export function normalizeYoutubeUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl);
    // Remove all query params, e.g., fbclid
    url.search = "";
    // Re-decode %40 so it stays as @ in the clean string representation
    return url.toString().replace(/%40/i, "@");
  } catch {
    // If unparseable, strip blindly
    return rawUrl.split("?")[0].replace(/%40/i, "@");
  }
}
