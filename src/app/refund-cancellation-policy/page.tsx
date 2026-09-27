import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Legend Photography",
  description: "Refund and cancellation policy for Legend Photography bookings.",
  robots: { index: false, follow: true },
};

export default function RefundCancellationPolicyPage() {
  return (
    <LegalPageLayout title="Refund & Cancellation Policy">
      <h2>1. Overview</h2>
      <p>
        This policy outlines the terms regarding cancellations, refunds, and rescheduling for photography services provided by {legalConfig.businessName}. By booking our services, you accept these terms.
      </p>

      <h2>2. Advance / Booking Amount</h2>
      <p>
        To secure our services for your event date, an advance payment is required. 
        {legalConfig.bookingAdvance 
          ? ` The required advance is ${legalConfig.bookingAdvance}.` 
          : " The specific advance amount will be outlined in your booking invoice."}
        Because securing a date prevents us from accepting other bookings for that day, the booking advance is generally non-refundable unless stated otherwise in your specific agreement.
      </p>

      <h2>3. Cancellation by Client</h2>
      <p>
        If you need to cancel your booking, please notify us as soon as possible.
        {legalConfig.cancellationPolicy 
          ? ` ${legalConfig.cancellationPolicy}` 
          : " Applicable refund and cancellation terms will depend on the booking agreement and the circumstances of the cancellation."}
      </p>

      <h2>4. Rescheduling and Postponement</h2>
      <p>
        We understand that event dates can sometimes change.
        {legalConfig.reschedulingPolicy 
          ? ` ${legalConfig.reschedulingPolicy}` 
          : " If you need to reschedule, we will do our best to accommodate your new date, subject to our availability. If we are unavailable on the new date, the cancellation policy will apply."}
      </p>

      <h2>5. Photographer Cancellation / Force Majeure</h2>
      <p>
        In the unlikely event that {legalConfig.businessName} is unable to perform the services due to extreme illness, emergency, or acts of God (Force Majeure), we will make every effort to secure a replacement photographer of similar standard. If a replacement cannot be found, any payments made to us will be fully refunded, and our liability shall be limited to this refund.
      </p>

      <h2>6. Deliverables Already Produced</h2>
      <p>
        No refunds will be provided for services already rendered, shoots already completed, or deliverables (such as digital galleries or physical albums) already produced and delivered to the client.
      </p>
    </LegalPageLayout>
  );
}
