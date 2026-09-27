import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Legend Photography",
  description: "General guidelines outlining booking cancellation, refund, postponement, and rescheduling terms for Legend Photography.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/refund-cancellation-policy",
  },
};

export default function RefundCancellationPolicyPage() {
  return (
    <LegalPageLayout 
      title="Refund & Cancellation Policy"
      eyebrow="POLICY"
      description="This policy explains the general approach to booking cancellations, refunds, postponements and related payment matters for Legend Photography services."
    >
      <div className="mb-8 rounded-xl border border-muted-foreground/20 bg-muted/10 p-4 text-sm text-muted-foreground">
        <p className="!m-0">
          <strong>Important Note:</strong> Specific payment, cancellation, refund and rescheduling terms may vary by booking and will be communicated at the time of confirmation.
        </p>
      </div>

      <div className="mb-12 rounded-2xl bg-muted/30 p-6 md:p-8">
        <h2 className="!mt-0 mb-4 font-serif text-xl">Quick Navigation</h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm !mb-0 !pl-0 !list-none">
          <li><a href="#booking-cancellation">01. Booking Cancellation</a></li>
          <li><a href="#advance-booking-payments">02. Advance & Booking Payments</a></li>
          <li><a href="#refund-eligibility">03. Refund Eligibility</a></li>
          <li><a href="#date-postponement">04. Date Postponement & Rescheduling</a></li>
          <li><a href="#cancellation-by-studio">05. Cancellation by Legend Photography</a></li>
          <li><a href="#force-majeure">06. Force Majeure</a></li>
          <li><a href="#non-refundable">07. Non-Refundable Components</a></li>
          <li><a href="#services-delivered">08. Services Already Delivered</a></li>
          <li><a href="#third-party-costs">09. Third-Party & External Costs</a></li>
          <li><a href="#refund-processing">10. Refund Processing</a></li>
          <li><a href="#contact">11. Contact</a></li>
        </ul>
      </div>

      <section id="booking-cancellation" className="scroll-mt-32">
        <h2>1. Booking Cancellation</h2>
        <p>
          Clients should communicate cancellation requests as early as reasonably possible. Cancellation may affect date availability and preparation already undertaken for the booking.
        </p>
        <p>
          A submitted inquiry is not necessarily a confirmed booking. Once a booking is confirmed, the applicable commercial terms should be reviewed by the client. Where a booking has been confirmed, any applicable cancellation and refund terms will be determined according to the terms communicated and agreed at the time of booking.
        </p>
      </section>

      <section id="advance-booking-payments" className="scroll-mt-32">
        <h2>2. Advance & Booking Payments</h2>
        <p>
          A booking may require an advance payment to secure a date if applicable. The applicable amount and payment schedule will be communicated during booking.
        </p>
        <p>
          Payment does not automatically guarantee every service unless the booking scope has been confirmed. Additional services outside the agreed scope may be separately chargeable.
        </p>
      </section>

      <section id="refund-eligibility" className="scroll-mt-32">
        <h2>3. Refund Eligibility</h2>
        <p>
          Refund eligibility may depend on whether the booking was confirmed, when the cancellation occurred, services already performed, preparation already undertaken, third-party costs, the agreed booking terms, and the circumstances surrounding cancellation.
        </p>
        <p>
          Any applicable refund will be determined according to the booking terms and the circumstances of the cancellation.
        </p>
      </section>

      <section id="date-postponement" className="scroll-mt-32">
        <h2>4. Date Postponement & Rescheduling</h2>
        <p>
          Clients should communicate date changes as early as possible. Requests to postpone or reschedule a confirmed booking will be considered based on availability and the terms applicable to the booking. 
        </p>
        <p>
          The new date may need to be mutually confirmed. Changes in venue, event type, duration or service scope may require updated terms, and additional costs may apply only where such costs are part of the agreed booking terms.
        </p>
      </section>

      <section id="cancellation-by-studio" className="scroll-mt-32">
        <h2>5. Cancellation by Legend Photography</h2>
        <p>
          If {legalConfig.businessName} is unable to provide the agreed service, we may communicate with the client regarding available alternatives. These may include rescheduling, alternative arrangements, or applicable refund consideration.
        </p>
        <p>
          Any applicable refund or alternative arrangement will be handled according to the circumstances and the terms agreed for the booking.
        </p>
      </section>

      <section id="force-majeure" className="scroll-mt-32">
        <h2>6. Force Majeure</h2>
        <p>
          Circumstances outside reasonable control may affect photography services or scheduled dates. Examples include natural disasters, severe weather, government restrictions, public emergencies, venue closures, transportation disruptions, major infrastructure failure, or other extraordinary circumstances beyond reasonable control.
        </p>
        <p>
          Reasonable alternatives may be discussed where feasible, including rescheduling. Any refund, rescheduling or alternative arrangement will depend on the circumstances and the applicable booking terms.
        </p>
      </section>

      <section id="non-refundable" className="scroll-mt-32">
        <h2>7. Non-Refundable Components</h2>
        <p>
          Certain costs or services may be non-refundable where this has been clearly communicated and agreed as part of the booking terms.
        </p>
        <p>
          Where applicable, third-party or committed costs (such as travel arrangements, location permits, or custom production costs) may be treated according to the terms communicated at the time of booking.
        </p>
      </section>

      <section id="services-delivered" className="scroll-mt-32">
        <h2>8. Services Already Delivered</h2>
        <p>
          If part of a photography service has already been performed, refund consideration may take into account services already completed, editing already performed, deliverables already supplied, third-party costs already incurred, and other agreed booking terms.
        </p>
      </section>

      <section id="third-party-costs" className="scroll-mt-32">
        <h2>9. Third-Party & External Costs</h2>
        <p>
          A booking may involve external costs where applicable, such as venue charges, location permits, travel, accommodation, or third-party production services.
        </p>
        <p>
          Where external costs are incurred or committed for a booking, their treatment may depend on the relevant third-party terms and the agreement with the client.
        </p>
      </section>

      <section id="refund-processing" className="scroll-mt-32">
        <h2>10. Refund Processing</h2>
        <p>
          Where a refund is applicable, the client will be informed of the applicable process. Refunds may be processed through the original or an agreed payment method where practical.
        </p>
        <p>
          Any applicable processing timeframe will be communicated when the refund is confirmed, as processing time may depend on the payment provider or banking system.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32">
        <h2>11. Contact</h2>
        <p>
          If you have questions about a cancellation, postponement or refund, please contact {legalConfig.businessName} using the contact options provided on the website.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/contact" 
            className="inline-flex h-12 items-center justify-center bg-foreground px-8 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90"
          >
            Contact Legend Photography
          </Link>
          <Link 
            href="/services" 
            className="inline-flex h-12 items-center justify-center border border-border bg-transparent px-8 text-sm font-medium tracking-wide text-foreground transition-colors hover:bg-muted"
          >
            View Services
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground pt-8 border-t border-border/50">
          <p>
            This Refund & Cancellation Policy should be read together with the {legalConfig.businessName} <Link href="/terms-and-conditions" className="underline hover:text-foreground">Terms & Conditions</Link> and any booking-specific terms communicated to the client.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
