import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/data/siteConfig";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/structuredData";
import Script from "next/script";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Legend Photography | Wedding & Pre-Wedding Photography",
    template: "%s | Legend Photography",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: "Legend Photography | Wedding & Pre-Wedding Photography",
    description: siteConfig.description,
    images: [{ url: "/images/hero/indian-wedding-hero.jpg", width: 2400, height: 1600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legend Photography",
    description: siteConfig.description,
    images: ["/images/hero/indian-wedding-hero.jpg"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), webSiteJsonLd()],
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} h-full overflow-x-hidden`}>
      <head>
      </head>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden">
        <Script
          id="json-ld-layout"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton floating />
      </body>
    </html>
  );
}
