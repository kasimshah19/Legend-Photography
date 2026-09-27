import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { legalConfig } from "@/data/legalConfig";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <>
      <Navbar variant="dark" />
      <div className="section-padding bg-background py-20 md:py-32">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-12 border-b border-border pb-8">
            <h1 className="font-serif text-4xl text-foreground md:text-5xl">{title}</h1>
            <p className="mt-4 text-sm tracking-wide text-muted uppercase">
              Last Updated: {legalConfig.lastUpdated}
            </p>
          </div>
          <div className="text-foreground/90 leading-relaxed [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:text-foreground [&>h2]:mt-12 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>a]:text-accent [&>a]:underline hover:[&>a]:text-foreground">
            {children}
          </div>
          <div className="mt-16 border-t border-border pt-8">
            <h3 className="font-serif text-xl">Questions about this policy?</h3>
            <p className="mt-4 text-muted">
              Please contact us via our <Link href="/contact" className="text-accent underline">contact page</Link> or email us directly at {legalConfig.contactEmail ? <a href={`mailto:${legalConfig.contactEmail}`} className="text-accent underline">{legalConfig.contactEmail}</a> : "[Email configurable via .env]"}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
