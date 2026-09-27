import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | Legend Photography",
  description: "Privacy policy detailing how Legend Photography collects and uses your information.",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <h2>1. Introduction</h2>
      <p>
        At {legalConfig.businessName}, we respect your privacy and are committed to protecting the personal information you share with us. This policy explains how we collect, use, and safeguard your data.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We only collect information necessary to provide our photography services and respond to your inquiries. When you use our contact form, we collect:
      </p>
      <ul>
        <li>Full Name</li>
        <li>Phone Number</li>
        <li>Email Address</li>
        <li>Event Details (Type of service, date, location, and requirements)</li>
      </ul>

      <h2>3. How We Use Information</h2>
      <p>
        The information we collect is used exclusively for the following purposes:
      </p>
      <ul>
        <li>To respond to your inquiries and provide accurate quotes.</li>
        <li>To communicate with you regarding your booking and event logistics.</li>
        <li>To deliver our photography services effectively.</li>
        <li>To maintain our internal booking records.</li>
      </ul>

      <h2>4. Data Sharing and Disclosure</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share necessary details only with trusted team members (such as second shooters or assistants) who are directly involved in executing your event.
      </p>

      <h2>5. Website Security</h2>
      <p>
        We implement standard security measures to protect the information you submit through our website. However, no data transmission over the internet can be guaranteed as 100% secure.
      </p>

      <h2>6. External Links</h2>
      <p>
        Our website may contain links to external sites (such as our social media profiles). We are not responsible for the privacy practices or content of these third-party websites.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.
      </p>
    </LegalPageLayout>
  );
}
