"use client";

import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  event: "phone_click" | "email_click" | "whatsapp_click";
  location: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

/**
 * Client-side link wrapper that fires analytics events on click.
 * Use this in RSC contexts where you can't add onClick directly.
 * NO PII is sent — only the interaction type and location.
 */
export function TrackedLink({
  href, event, location, children, className, target, rel, ariaLabel,
}: TrackedLinkProps) {
  const handleClick = () => {
    switch (event) {
      case "phone_click":
        trackPhoneClick(location);
        break;
      case "email_click":
        trackEmailClick(location);
        break;
      case "whatsapp_click":
        trackWhatsAppClick(location);
        break;
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
