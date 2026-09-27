import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Legend Photography",
  description: "Terms and conditions governing the use of the Legend Photography website and photography services.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout 
      title="Terms & Conditions"
      eyebrow="LEGAL"
      description="These terms outline the general conditions that apply to use of the Legend Photography website and photography services."
    >
      <div className="mb-12 rounded-2xl bg-muted/30 p-6 md:p-8">
        <h2 className="!mt-0 mb-4 font-serif text-xl">Quick Navigation</h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm !mb-0 !pl-0 !list-none">
          <li><a href="#introduction">01. Introduction</a></li>
          <li><a href="#website-usage">02. Website Usage</a></li>
          <li><a href="#photography-services">03. Photography Services</a></li>
          <li><a href="#inquiry-booking">04. Inquiry & Booking</a></li>
          <li><a href="#payment-advance">05. Payment & Advance</a></li>
          <li><a href="#cancellation-rescheduling">06. Cancellation & Rescheduling</a></li>
          <li><a href="#deliverables">07. Deliverables</a></li>
          <li><a href="#client-responsibilities">08. Client Responsibilities</a></li>
          <li><a href="#intellectual-property">09. Intellectual Property</a></li>
          <li><a href="#portfolio-usage">10. Portfolio & Promotional Usage</a></li>
          <li><a href="#limitation-of-liability">11. Limitation of Liability</a></li>
          <li><a href="#force-majeure">12. Force Majeure</a></li>
          <li><a href="#changes-to-terms">13. Changes to These Terms</a></li>
          <li><a href="#contact">14. Contact</a></li>
        </ul>
      </div>

      <section id="introduction" className="scroll-mt-32">
        <h2>1. Introduction</h2>
        <p>
          These Terms &amp; Conditions apply to your use of the {legalConfig.businessName} website. They also provide general terms relating to inquiries and photography services.
        </p>
        <p>
          By using this website, you agree to use it lawfully and responsibly. Actual photography bookings may also be governed by booking-specific terms communicated to the client at the time of booking.
        </p>
      </section>

      <section id="website-usage" className="scroll-mt-32">
        <h2>2. Website Usage</h2>
        <p>Website content is provided for general informational purposes. As a user, you agree that you must not:</p>
        <ul>
          <li>Misuse the website or attempt unauthorized access.</li>
          <li>Interfere with the website&apos;s normal operation.</li>
          <li>Reproduce or commercially exploit website content without prior written permission.</li>
          <li>Submit fraudulent or misleading information through inquiry forms.</li>
        </ul>
        <p>Users must comply with all applicable laws while using this website.</p>
      </section>

      <section id="photography-services" className="scroll-mt-32">
        <h2>3. Photography Services</h2>
        <p>
          We provide professional photography services, which may include wedding, pre-wedding, engagement, maternity, and portrait photography, where applicable and mutually agreed.
        </p>
        <p>
          The scope of services depends on the selected package or booking agreement. Availability is subject to date and scheduling. Final deliverables depend on the agreed scope. Because photography is a creative service, creative output and style may naturally vary.
        </p>
      </section>

      <section id="inquiry-booking" className="scroll-mt-32">
        <h2>4. Inquiry & Booking</h2>
        <p>
          Submitting an inquiry through our website does not automatically confirm a booking. All bookings are subject to availability.
        </p>
        <p>
          A date becomes officially confirmed only after {legalConfig.businessName} confirms it according to our internal booking process. Clients may need to provide accurate event details to secure a booking. Any changes to the event date, location, service type, or scope should be communicated to us promptly.
        </p>
      </section>

      <section id="payment-advance" className="scroll-mt-32">
        <h2>5. Payment & Advance</h2>
        <p>
          Applicable pricing and payment terms are communicated during the booking process. An advance payment may be required to secure a booking if applicable.
        </p>
        <p>
          Any applicable advance, payment schedule and outstanding balance will be communicated and agreed at the time of booking. Additional services outside the agreed scope may carry additional charges.
        </p>
      </section>

      <section id="cancellation-rescheduling" className="scroll-mt-32">
        <h2>6. Cancellation & Rescheduling</h2>
        <p>
          Clients should communicate any cancellation or rescheduling requests as early as possible. Rescheduling depends entirely on date availability, and changes may affect the agreed service schedule.
        </p>
        <p>
          Any applicable cancellation, rescheduling and refund terms will be based on the terms communicated and agreed at the time of booking. Circumstances such as third-party venue restrictions or extraordinary events may also affect scheduling.
        </p>
      </section>

      <section id="deliverables" className="scroll-mt-32">
        <h2>7. Deliverables</h2>
        <p>
          Deliverables are based on the selected service, package, and agreed scope. Potential deliverables may include edited photographs, selected images, albums, video/film, and digital delivery.
        </p>
        <p>
          The final quantity of images depends on the agreed package. Creative selection and editing decisions may be made according to the agreed workflow of the studio. The delivery format may vary depending on the service selected.
        </p>
      </section>

      <section id="client-responsibilities" className="scroll-mt-32">
        <h2>8. Client Responsibilities</h2>
        <p>To ensure the best possible service, clients are expected to:</p>
        <ul>
          <li>Provide accurate event and contact information.</li>
          <li>Communicate any schedule or location changes promptly.</li>
          <li>Arrive or make arrangements according to the agreed schedule.</li>
          <li>Obtain required permissions for photography locations where necessary.</li>
          <li>Communicate relevant restrictions to the photography team in advance.</li>
          <li>Ensure guests and participants understand applicable photography arrangements where appropriate.</li>
          <li>Cooperate with reasonable instructions during the shoot.</li>
        </ul>
      </section>

      <section id="intellectual-property" className="scroll-mt-32">
        <h2>9. Intellectual Property</h2>
        <p>
          Photographs and creative works may be protected by applicable copyright laws. Ownership and permitted usage depend on the applicable agreement and law.
        </p>
        <p>
          Clients should not assume that receiving digital photographs automatically transfers all intellectual property rights. Reproduction, resale, commercial licensing, or significant modification of the images may require prior permission depending on the agreed terms.
        </p>
      </section>

      <section id="portfolio-usage" className="scroll-mt-32">
        <h2>10. Portfolio & Promotional Usage</h2>
        <p>
          Where the applicable booking agreement or client consent permits, selected photographs may be used for portfolio or promotional purposes, including on our website, social media channels, and promotional materials.
        </p>
      </section>

      <section id="limitation-of-liability" className="scroll-mt-32">
        <h2>11. Limitation of Liability</h2>
        <p>
          To the extent permitted by applicable law, our liability is reasonably limited in situations outside of our control. These may include, but are not limited to, venue restrictions, severe weather, technical or equipment failures, transportation disruptions, third-party service failures, or other extraordinary events.
        </p>
      </section>

      <section id="force-majeure" className="scroll-mt-32">
        <h2>12. Force Majeure</h2>
        <p>
          Certain circumstances outside our reasonable control may affect service delivery or scheduling. These include natural disasters, severe weather, government restrictions, public emergencies, venue closures, transportation disruptions, or other extraordinary circumstances.
        </p>
        <p>
          In such events, the parties may discuss reasonable alternatives such as rescheduling where feasible, rather than automatically assuming obligations remain unchanged.
        </p>
      </section>

      <section id="changes-to-terms" className="scroll-mt-32">
        <h2>13. Changes to These Terms</h2>
        <p>
          These terms may be updated periodically. The updated version will be published on this page, and the &quot;Last Updated&quot; date will reflect meaningful updates. Booking-specific terms already agreed with a client may be governed by the applicable agreement in place at the time of booking.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32">
        <h2>14. Contact</h2>
        <p>
          If you have questions about these Terms &amp; Conditions, please contact {legalConfig.businessName} through the contact options provided on this website.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/contact" 
            className="inline-flex h-12 items-center justify-center bg-foreground px-8 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90"
          >
            Contact Legend Photography
          </Link>
          <Link 
            href="/portfolio" 
            className="inline-flex h-12 items-center justify-center border border-border bg-transparent px-8 text-sm font-medium tracking-wide text-foreground transition-colors hover:bg-muted"
          >
            View Portfolio
          </Link>
        </div>
      </section>
    </LegalPageLayout>
  );
}
