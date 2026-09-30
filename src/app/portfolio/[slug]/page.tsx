import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { Navbar } from "@/components/Navbar";
import { CTASection } from "@/components/CTASection";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { AlbumGallery } from "@/components/portfolio/AlbumGallery";
import { getPublishedAlbumBySlug, getAllPublishedSlugs } from "@/lib/portfolioData";
import Script from "next/script";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const album = await getPublishedAlbumBySlug(resolvedParams.slug);

  if (!album) {
    return { title: "Album Not Found" };
  }

  const title = `${album.title} | ${album.category.charAt(0).toUpperCase() + album.category.slice(1)} Photography | Legend Photography`;
  const desc = album.seoDescription || album.description || '';
  const pageTitle = album.seoTitle || title;
  
  return {
    title: pageTitle,
    description: desc,
    alternates: { canonical: `${siteConfig.url}/portfolio/${album.slug}` },
    openGraph: {
      type: "article",
      title: pageTitle,
      description: desc,
      url: `${siteConfig.url}/portfolio/${album.slug}`,
      images: [{ url: album.ogImage || album.coverImage, width: 1200, height: 630, alt: album.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [album.ogImage || album.coverImage],
    }
  };
}

export default async function AlbumPage({ params }: Props) {
  const resolvedParams = await params;
  const album = await getPublishedAlbumBySlug(resolvedParams.slug);

  if (!album) {
    notFound();
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Portfolio", url: `${siteConfig.url}/portfolio` },
    { name: album.title, url: `${siteConfig.url}/portfolio/${album.slug}` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: album.title,
    description: album.description,
    url: `${siteConfig.url}/portfolio/${album.slug}`,
    image: album.coverImage,
    creator: {
      "@type": "PhotographyStudio",
      name: siteConfig.name,
    },
  };

  // Convert gallery to the format AlbumGallery expects
  const galleryItems = album.gallery.map((img: any, i: number) => ({
    id: `img-${i}`,
    src: img.url,
    alt: img.alt || album.title,
    category: album.category,
    title: img.alt || `Image ${i + 1}`,
  }));

  return (
    <>
      <Script
        id={`json-ld-album-breadcrumb-${album.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id={`json-ld-album-webpage-${album.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Navbar variant="light" />
      
      {/* Album Hero */}
      <section className="relative min-h-[60vh] w-full md:min-h-[70vh]">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="section-padding flex flex-col items-center">
            <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl lg:text-7xl uppercase tracking-wider">
              {album.title}
            </h1>
            <div className="mt-6 flex flex-col items-center gap-2 md:flex-row md:gap-4 text-xs uppercase tracking-[0.2em] text-white/80">
              <span>{album.category.replace("-", " ")} Photography</span>
              {album.location && (
                <>
                  <span className="hidden md:inline">•</span>
                  <span>{album.location}</span>
                </>
              )}
              {album.eventDate && (
                <>
                  <span className="hidden md:inline">•</span>
                  <span>{album.eventDate}</span>
                </>
              )}
            </div>
            {album.description && (
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base font-light">
                {album.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Album Gallery */}
      <AlbumGallery items={galleryItems} />

      <CTASection compact />
    </>
  );
}
