import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ButtonLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Thank You | Legend Photography",
  description: "Your inquiry has been received.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar variant="dark" />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-6 py-32 text-center">
        <Reveal variant="up">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Inquiry Received
          </span>
          <h1 className="font-serif text-5xl text-foreground md:text-6xl">
            Thank You.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-muted">
            We have received your details. We will review your requirements and get back to you shortly to discuss your story.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/" variant="primary">
              Return Home
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">
              View Portfolio
            </ButtonLink>
          </div>
          
          {siteConfig.whatsapp && (
            <div className="mt-16 border-t border-border pt-12">
              <p className="mb-4 text-sm text-muted">Need a quicker response?</p>
              <div className="flex justify-center">
                <WhatsAppButton label="Message on WhatsApp" />
              </div>
            </div>
          )}
        </Reveal>
      </main>
    </>
  );
}
