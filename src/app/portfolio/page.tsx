import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { FilmsSection } from "@/components/portfolio/FilmsSection";
import { CTASection } from "@/components/CTASection";
import { siteConfig } from "@/data/siteConfig";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Photography Portfolio | Legend Photography",
  description:
    "Explore our curated photography portfolio featuring authentic wedding, pre-wedding, engagement, candid, maternity, portrait and event stories.",
  alternates: { canonical: `${siteConfig.url}/portfolio` },
  openGraph: {
    title: "Photography Portfolio | Legend Photography",
    description:
      "Explore our curated photography portfolio featuring authentic wedding, pre-wedding, engagement, candid, maternity, portrait and event stories.",
    url: `${siteConfig.url}/portfolio`,
  },
};

import { getPublishedFilms } from "@/lib/filmData";
import { getPublishedAlbums } from "@/lib/portfolioData";
export default async function PortfolioPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Portfolio", url: `${siteConfig.url}/portfolio` },
  ]);

  const films = await getPublishedFilms();
  const dbAlbums = await getPublishedAlbums();

  return (
    <>
      <Script
        id="json-ld-portfolio"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar variant="dark" />
      <PageHero
        eyebrow="LEGEND PHOTOGRAPHY"
        title="Stories Told Through Light."
        subtitle={"A curated selection of our favorite moments,\ncaptured with elegance and authenticity."}
        videos={["/videos/couple-6.mp4", "/videos/couple-7.mp4"]}
        imageAlt="Legend Photography portfolio — wedding photography"
      />
      <Suspense fallback={<div className="section-padding py-20 text-muted">Loading gallery...</div>}>
        <PortfolioGallery dbAlbums={dbAlbums} />
      </Suspense>
      <FilmsSection films={films} />
      <CTASection compact />
    </>
  );
}
