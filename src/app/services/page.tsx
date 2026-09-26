import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { ServiceSection } from "@/components/ServiceSection";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { CTASection } from "@/components/CTASection";
import { Reveal } from "@/components/Reveal";
import { services } from "@/data/services";
import { siteConfig } from "@/data/siteConfig";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { PackageComparison } from "@/components/services/PackageComparison";
import { FAQSection } from "@/components/services/FAQSection";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Photography Services",
  description:
    "Wedding, pre-wedding, maternity, portrait, fashion and event photography services.",
  alternates: { canonical: `${siteConfig.url}/services` },
};

export default function ServicesPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Services", url: `${siteConfig.url}/services` },
  ]);

  return (
    <>
      <Script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar variant="dark" />
      <PageHero
        eyebrow="WHAT WE DO"
        title="Crafting Memories Into Art."
        subtitle={"Photography crafted\naround your story."}
        videos={["/videos/couple-8.mp4", "/videos/couple-9.mp4"]}
        imageAlt="Legend Photography services — pre-wedding photography"
      />

      <div className="section-padding mx-auto max-w-[1400px]">
        {services.map((service, index) => (
          <ServiceSection key={service.id} service={service} index={index} />
        ))}
      </div>

      <PackageComparison />

      <section className="relative overflow-hidden py-28 md:py-40">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/portfolio/wedding-01.jpg" 
            alt="Legend Photography Custom Packages" 
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/65 transition-opacity"></div>
        </div>
        
        <div className="section-padding relative z-10 mx-auto max-w-4xl text-center text-white">
          <Reveal>
            <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Tailored For You
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              Every celebration is beautifully different.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base md:text-lg text-white/80 leading-relaxed font-light">
              Have a unique requirement? Tell us about your event and we&apos;ll craft a bespoke photography experience perfectly tailored to your vision.
            </p>
            <div className="mt-12">
              <a 
                href="/contact" 
                className="inline-block border border-white/50 bg-white text-black hover:bg-black/50 hover:text-white hover:border-white transition-all duration-500 px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em]"
              >
                Get a Custom Quote
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <ProcessTimeline />
      
      <FAQSection />

      <CTASection compact />
    </>
  );
}
