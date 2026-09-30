import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PublicOnly } from "@/components/PublicOnly";
import { siteConfig } from "@/data/siteConfig";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/structuredData";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings.seo.defaultTitle,
      template: settings.seo.titleTemplate,
    },
    description: settings.seo.defaultDescription,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: settings.name,
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: [{ url: settings.seo.defaultOgImage, width: 2400, height: 1600, alt: "Legend Photography" }],
      url: settings.url,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: [settings.seo.defaultOgImage],
      creator: "@legendphotography",
    },
    alternates: {
      canonical: settings.url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(settings), webSiteJsonLd(settings)],
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} h-full overflow-x-hidden`}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden">
        <Script
          id="json-ld-layout"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-1">{children}</main>
        <PublicOnly>
          <Footer settings={settings} />
          <WhatsAppButton floating whatsappNumber={settings.whatsapp} />
        </PublicOnly>
      </body>
    </html>
  );
}
