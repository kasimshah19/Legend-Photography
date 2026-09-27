import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { legalConfig } from "@/data/legalConfig";

export const metadata: Metadata = {
  title: "Cookie Policy | Legend Photography",
  description: "Information about how Legend Photography uses cookies on this website.",
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide a better browsing experience.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>
        The {legalConfig.businessName} website is built using modern web technologies that prioritize performance and privacy. We use cookies only when necessary for the core functionality of the website.
      </p>

      <h2>3. Essential Cookies</h2>
      <p>
        We may use essential cookies that are strictly necessary to run the website. These cookies enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.
      </p>

      <h2>4. Analytics and Third-Party Cookies</h2>
      <p>
        Our website focuses on providing a clean portfolio experience. We do not currently use aggressive third-party advertising trackers or marketing cookies. If we integrate standard analytics (such as Vercel Analytics) to understand website traffic, these tools process data in an anonymized manner to help us improve our website performance.
      </p>

      <h2>5. Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings preferences. You can configure your browser to accept, reject, or delete cookies. Please refer to your browser's help documentation for instructions on how to manage your cookie preferences.
      </p>
    </LegalPageLayout>
  );
}
