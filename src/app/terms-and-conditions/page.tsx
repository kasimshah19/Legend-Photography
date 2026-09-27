import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";

export const metadata: Metadata = {
  title: "Terms & Conditions | Legend Photography",
  description: "Terms and conditions for Legend Photography services and website usage.",
  robots: { index: false, follow: true },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <h2>1. Introduction</h2>
      <p>
        These Terms &amp; Conditions govern your use of the {legalConfig.businessName} website and the photography services we provide. By using our website or booking our services, you agree to these terms.
      </p>

      <h2>2. Photography Services</h2>
      <p>
        We provide professional photography services including, but not limited to, wedding, pre-wedding, maternity, and portrait photography. The specific details, deliverables, and coverage for your event will be outlined in your booking agreement.
      </p>

      <h2>3. Inquiry and Booking</h2>
      <p>
        An inquiry through our website does not guarantee a booking. A booking is only confirmed once a formal agreement is reached and any required advance payment is received.
        {legalConfig.bookingAdvance 
          ? ` A booking advance of ${legalConfig.bookingAdvance} is required to secure your date.` 
          : " Any applicable booking advance and payment schedule will be communicated to the client at the time of booking."}
      </p>

      <h2>4. Payment Terms</h2>
      <p>
        {legalConfig.paymentTerms 
          ? legalConfig.paymentTerms 
          : "Payment schedules and accepted methods of payment will be detailed in your final booking invoice."}
      </p>

      <h2>5. Cancellation and Rescheduling</h2>
      <p>
        {legalConfig.cancellationWindow 
          ? `Cancellations must be made at least ${legalConfig.cancellationWindow} prior to the event.` 
          : "Applicable cancellation and rescheduling policies will depend on the booking agreement and the circumstances of the cancellation."}
        {legalConfig.reschedulingPolicy ? ` ${legalConfig.reschedulingPolicy}` : ""}
      </p>

      <h2>6. Deliverables and Editing</h2>
      <p>
        All images delivered are professionally edited in the signature style of {legalConfig.businessName}. Raw files are generally not provided unless explicitly agreed upon.
        {legalConfig.deliveryTimeline 
          ? ` Final edited photographs will typically be delivered within ${legalConfig.deliveryTimeline}.` 
          : " Delivery timelines for final photographs and albums will be specified in your booking agreement."}
      </p>

      <h2>7. Intellectual Property and Portfolio Usage</h2>
      <p>
        {legalConfig.businessName} retains the copyright to all images created. We reserve the right to use the photographs for portfolio, promotional, and marketing purposes unless a confidentiality agreement is explicitly arranged prior to the booking.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        While we take the utmost care in capturing your moments, our liability for any loss of digital files, equipment failure, or unforeseen circumstances preventing coverage is limited to the refund of amounts paid for the affected services.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        {legalConfig.governingLaw 
          ? `These terms shall be governed by the laws of ${legalConfig.governingLaw}.` 
          : "These terms are governed by the applicable laws of our operating jurisdiction."}
        {legalConfig.jurisdiction 
          ? ` Any disputes will be subject to the exclusive jurisdiction of the courts in ${legalConfig.jurisdiction}.` 
          : ""}
      </p>
    </LegalPageLayout>
  );
}
