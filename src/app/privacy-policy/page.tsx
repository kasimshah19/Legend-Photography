import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Legend Photography",
  description: "Learn how Legend Photography collects, uses, and protects information submitted through our website and inquiry forms.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout 
      title="Privacy Policy"
      eyebrow="PRIVACY"
      description="Your privacy matters to us. This policy explains how information submitted through the Legend Photography website may be collected, used, stored and handled."
    >
      <div className="mb-12 rounded-2xl bg-muted/30 p-6 md:p-8">
        <h2 className="!mt-0 mb-4 font-serif text-xl">Quick Navigation</h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm !mb-0 !pl-0 !list-none">
          <li><a href="#introduction">01. Introduction</a></li>
          <li><a href="#information-we-collect">02. Information We Collect</a></li>
          <li><a href="#contact-inquiry">03. Contact & Inquiry Information</a></li>
          <li><a href="#how-we-use">04. How We Use Information</a></li>
          <li><a href="#form-submissions">05. Form Submissions</a></li>
          <li><a href="#phone-email">06. Phone & Email Communication</a></li>
          <li><a href="#cookies">07. Cookies & Similar Technologies</a></li>
          <li><a href="#analytics">08. Analytics</a></li>
          <li><a href="#data-storage">09. Data Storage & Retention</a></li>
          <li><a href="#third-party">10. Third-Party Services</a></li>
          <li><a href="#data-security">11. Data Security</a></li>
          <li><a href="#sharing">12. Sharing of Information</a></li>
          <li><a href="#external-links">13. External Links</a></li>
          <li><a href="#user-rights">14. User Rights</a></li>
          <li><a href="#childrens-privacy">15. Children&apos;s Privacy</a></li>
          <li><a href="#policy-updates">16. Policy Updates</a></li>
          <li><a href="#contact">17. Contact</a></li>
        </ul>
      </div>

      <section id="introduction" className="scroll-mt-32">
        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy applies to information collected through the {legalConfig.businessName} website. It explains how information may be handled when visitors browse the website or submit an inquiry.
        </p>
        <p>
          This policy should be read together with our <Link href="/terms-and-conditions">Terms & Conditions</Link>.
        </p>
      </section>

      <section id="information-we-collect" className="scroll-mt-32">
        <h2>2. Information We Collect</h2>
        <p>
          When you use our website, particularly our contact forms, we may collect the following information that you voluntarily provide:
        </p>
        <ul>
          <li>Name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Service type</li>
          <li>Event date</li>
          <li>Location</li>
          <li>Number of events</li>
          <li>Message or additional details</li>
        </ul>
      </section>

      <section id="contact-inquiry" className="scroll-mt-32">
        <h2>3. Contact & Inquiry Information</h2>
        <p>
          Visitors may voluntarily provide information for purposes such as requesting photography services, asking about availability, discussing an event, requesting package information, or contacting the studio.
        </p>
        <p>
          This information may be used to respond to inquiries, understand the requested photography service, discuss availability, communicate regarding the inquiry, and coordinate potential bookings.
        </p>
      </section>

      <section id="how-we-use" className="scroll-mt-32">
        <h2>4. How We Use Information</h2>
        <p>
          We use the information collected for legitimate purposes supported by the website, which may include:
        </p>
        <ul>
          <li>Responding to your inquiries.</li>
          <li>Communicating about requested services.</li>
          <li>Understanding your event requirements.</li>
          <li>Processing or coordinating bookings where applicable.</li>
          <li>Providing requested information.</li>
          <li>Maintaining website functionality and protecting the website from misuse.</li>
        </ul>
      </section>

      <section id="form-submissions" className="scroll-mt-32">
        <h2>5. Form Submissions</h2>
        <p>
          When you submit an inquiry through the website, the information you provide is processed so that {legalConfig.businessName} can review and respond to your request.
        </p>
        <p>
          Form submissions are sent securely to our backend systems and stored in our database for the purpose of managing and responding to your inquiry.
        </p>
      </section>

      <section id="phone-email" className="scroll-mt-32">
        <h2>6. Phone & Email Communication</h2>
        <p>
          The contact details you provide, such as your phone number and email address, may be used to respond to your inquiry and facilitate communication regarding your event.
        </p>
        <p>
          If you contact us via WhatsApp, please note that WhatsApp is a third-party service and its own privacy terms may apply to the communication on their platform.
        </p>
      </section>

      <section id="cookies" className="scroll-mt-32">
        <h2>7. Cookies & Similar Technologies</h2>
        <p>
          Our website focuses on providing a clean portfolio experience and uses technologies necessary for core website functionality. 
        </p>
        <p>
          For more detailed information about our use of cookies, please review our <Link href="/cookie-policy">Cookie Policy</Link>.
        </p>
      </section>

      <section id="analytics" className="scroll-mt-32">
        <h2>8. Analytics</h2>
        <p>
          The website does not currently implement dedicated marketing analytics or tracking services (such as Google Analytics). Any analytics tools used by our hosting infrastructure process data in an anonymized manner to help us improve our website performance.
        </p>
      </section>

      <section id="data-storage" className="scroll-mt-32">
        <h2>9. Data Storage & Retention</h2>
        <p>
          Inquiry information submitted through our website is stored in a secure database (MongoDB). Information may be retained for as long as reasonably necessary to respond to inquiries, manage business communications, fulfill applicable obligations, or maintain relevant records.
        </p>
        <p>
          Specific retention periods may vary depending on business requirements and applicable record-keeping obligations.
        </p>
      </section>

      <section id="third-party" className="scroll-mt-32">
        <h2>10. Third-Party Services</h2>
        <p>
          Our website utilizes certain third-party services for essential functionality:
        </p>
        <ul>
          <li><strong>Database Hosting:</strong> Used to securely store inquiry information.</li>
          <li><strong>YouTube:</strong> Used for embedded photography films and video reels.</li>
          <li><strong>Social Media (Instagram, Facebook, WhatsApp):</strong> Used as external communication channels or portfolio links.</li>
        </ul>
        <p>
          These third-party services operate under their own privacy policies. We do not control their privacy practices.
        </p>
      </section>

      <section id="data-security" className="scroll-mt-32">
        <h2>11. Data Security</h2>
        <p>
          Reasonable measures are taken to protect information against unauthorized access, misuse or disclosure. However, no method of transmission or storage can be guaranteed to be completely secure.
        </p>
      </section>

      <section id="sharing" className="scroll-mt-32">
        <h2>12. Sharing of Information</h2>
        <p>
          Information may be shared only where reasonably necessary for legitimate website and business operations. This may include service providers supporting website infrastructure (such as hosting and database providers), or to comply with legal and regulatory requirements where applicable.
        </p>
      </section>

      <section id="external-links" className="scroll-mt-32">
        <h2>13. External Links</h2>
        <p>
          The website may contain links to third-party services such as Instagram, Facebook, YouTube, and WhatsApp. External websites have their own policies, and {legalConfig.businessName} does not control third-party privacy practices. Users should review the relevant third-party privacy policy.
        </p>
      </section>

      <section id="user-rights" className="scroll-mt-32">
        <h2>14. User Rights</h2>
        <p>
          Users may contact us to ask what information they submitted, request correction of inaccurate information, ask questions about how their inquiry information is handled, or request deletion where appropriate and legally possible.
        </p>
        <p>
          Requests will be considered subject to applicable legal, operational and contractual requirements.
        </p>
      </section>

      <section id="childrens-privacy" className="scroll-mt-32">
        <h2>15. Children&apos;s Privacy</h2>
        <p>
          Website inquiries should be submitted by a parent, guardian, or authorized adult where the inquiry concerns photography services for a child. We do not knowingly collect unnecessary personal information from children through the website.
        </p>
      </section>

      <section id="policy-updates" className="scroll-mt-32">
        <h2>16. Policy Updates</h2>
        <p>
          This Privacy Policy may be updated when website practices or business requirements change. The updated version will be published on this page, and the &quot;Last Updated&quot; date will indicate the latest revision.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32">
        <h2>17. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or how your information is handled, please contact {legalConfig.businessName}.
        </p>
        <div className="mt-8">
          <Link 
            href="/contact" 
            className="inline-flex h-12 items-center justify-center bg-foreground px-8 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90"
          >
            Contact Legend Photography
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
