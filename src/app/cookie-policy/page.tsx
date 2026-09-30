import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Legend Photography",
  description: "This page describes the use of cookies and similar technologies on the Legend Photography website.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout 
      title="Cookie Policy"
      eyebrow="PRIVACY"
      description="This page explains how cookies and similar technologies may be used on the Legend Photography website."
    >
      <div className="mb-8 rounded-xl border border-muted-foreground/20 bg-muted/10 p-4 text-sm text-muted-foreground">
        <p className="!m-0">
          <strong>Current status:</strong> This website uses Google Analytics 4 for aggregate website traffic analysis. No cookies are used for advertising or behavioral tracking. No personally identifiable information is collected through analytics.
        </p>
      </div>

      <div className="mb-12 rounded-2xl bg-muted/30 p-6 md:p-8">
        <h2 className="!mt-0 mb-4 font-serif text-xl">Quick Navigation</h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm !mb-0 !pl-0 !list-none">
          <li><a href="#what-are-cookies">01. What Are Cookies?</a></li>
          <li><a href="#how-cookies-are-used">02. How Cookies Are Used</a></li>
          <li><a href="#necessary-technologies">03. Necessary Technologies</a></li>
          <li><a href="#analytics-technologies">04. Optional / Analytics Technologies</a></li>
          <li><a href="#third-party-services">05. Third-Party Services</a></li>
          <li><a href="#managing-cookies">06. Managing Cookies</a></li>
          <li><a href="#browser-controls">07. Browser Controls</a></li>
          <li><a href="#policy-updates">08. Policy Updates</a></li>
          <li><a href="#contact">09. Contact</a></li>
        </ul>
      </div>

      <section id="what-are-cookies" className="scroll-mt-32">
        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small pieces of information stored by websites in a user&apos;s browser. They can be used for functionality, preferences, analytics, or other purposes. Similar technologies may also include certain browser storage mechanisms like local storage.
        </p>
      </section>

      <section id="how-cookies-are-used" className="scroll-mt-32">
        <h2>2. How Cookies Are Used</h2>
        <p>
          The {legalConfig.businessName} website is designed to operate with minimal data collection. We do not use cookies for advertising, behavioral profiling, or cross-site tracking.
        </p>
      </section>

      <section id="necessary-technologies" className="scroll-mt-32">
        <h2>3. Necessary Technologies</h2>
        <p>
          No dedicated cookie-based essential functionality was identified during the current implementation audit. Normal browser or server functionality may involve technical mechanisms required to securely load and render the website, but no persistent operational cookies are set by our platform.
        </p>
      </section>

      <section id="analytics-technologies" className="scroll-mt-32">
        <h2>4. Optional / Analytics Technologies</h2>
        <p>
          This website uses Google Analytics 4 (GA4) by Google LLC for aggregate website analytics. GA4 uses cookies to collect anonymized data such as page views, session duration, device type, and geographic region. No personally identifiable information (PII) — such as names, email addresses, phone numbers, or message contents — is sent to Google Analytics.
        </p>
        <p>
          Google Analytics data is used solely by the website owner for understanding aggregate traffic patterns and improving the website experience. You may opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
        </p>
      </section>

      <section id="third-party-services" className="scroll-mt-32">
        <h2>5. Third-Party Services</h2>
        <p>
          Our website includes external links to third-party platforms (such as our Instagram profile, YouTube channel, and direct WhatsApp chat). 
        </p>
        <p>
          Clicking these links will take you directly to those respective third-party platforms. Once you navigate away from the {legalConfig.businessName} website, those third parties control their own technology, cookies, and privacy practices. We do not install third-party tracking pixels (like Meta Pixel or TikTok Pixel) on our website.
        </p>
      </section>

      <section id="managing-cookies" className="scroll-mt-32">
        <h2>6. Managing Cookies</h2>
        <p>
          Because our website does not utilize non-essential tracking cookies or a dedicated analytics suite, we do not require a cookie consent banner. Users can manage or delete any general browser data through their browser settings. Disabling certain technologies across the web may affect how some websites function, though it should not impact your ability to view our portfolio or submit an inquiry.
        </p>
      </section>

      <section id="browser-controls" className="scroll-mt-32">
        <h2>7. Browser Controls</h2>
        <p>
          Modern browsers allow users to:
        </p>
        <ul>
          <li>View stored cookies and site data</li>
          <li>Delete cookies</li>
          <li>Block third-party cookies</li>
          <li>Configure site-specific permissions</li>
        </ul>
        <p>
          You can adjust these settings directly in the privacy or security section of your browser (e.g., Chrome, Safari, Firefox, Edge).
        </p>
      </section>

      <section id="policy-updates" className="scroll-mt-32">
        <h2>8. Policy Updates</h2>
        <p>
          This policy may be updated if our website technology changes—for instance, if we decide to implement basic analytics to improve website performance in the future. Meaningful changes will be reflected on this page, and the Last Updated date will indicate the current version.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32">
        <h2>9. Contact</h2>
        <p>
          If you have questions about this Cookie Policy or how cookies and similar technologies are used on the website, please contact {legalConfig.businessName}.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/contact" 
            className="inline-flex h-12 items-center justify-center bg-foreground px-8 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90"
          >
            Contact Legend Photography
          </Link>
        </div>
        
        <div className="mt-12 space-y-4 text-sm text-muted-foreground pt-8 border-t border-border/50">
          <p>
            For information about how personal information submitted through the website is handled, please review our <Link href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
          <p>
            Use of the website is also subject to the <Link href="/terms-and-conditions" className="underline hover:text-foreground">Terms &amp; Conditions</Link>.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
