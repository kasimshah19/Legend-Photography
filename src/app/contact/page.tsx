import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { QuickContact } from "@/components/contact/QuickContact";
import { PhotographerStory } from "@/components/contact/PhotographerStory";
import { StudioLocation } from "@/components/contact/StudioLocation";
import { siteConfig } from "@/data/siteConfig";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { Reveal } from "@/components/Reveal";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact Legend Photography | Book Your Shoot",
  description:
    "Get in touch with Legend Photography for wedding, pre-wedding, maternity and portrait photography enquiries.",
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Contact", url: `${siteConfig.url}/contact` },
  ]);

  return (
    <>
      <Script
        id="json-ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar variant="dark" />
      
      <PageHero
        eyebrow="LET'S CREATE SOMETHING BEAUTIFUL"
        title="Your Story Starts Here."
        subtitle={"Tell us about your event,\nyour vision and the moments\nyou want us to capture."}
        videos={["/videos/couple-10.mp4", "/videos/couple-11.mp4"]}
        imageAlt="Contact Legend Photography to book a shoot"
      />

      <PhotographerStory />
      
      <StudioLocation />

      <section className="section-padding mx-auto max-w-[1400px] py-20 md:py-32" id="inquiry">
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Book a Shoot
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              START YOUR INQUIRY
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-5 items-start">
          <Reveal className="lg:col-span-3" variant="up">
            <div className="bg-white p-8 md:p-12 border border-border/50 shadow-sm">
              <ContactForm />
            </div>
          </Reveal>
          
          <Reveal className="lg:col-span-2" variant="up" delay={200}>
            <div className="sticky top-32">
              <QuickContact />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
