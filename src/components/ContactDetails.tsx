import { telUrl, whatsappUrl } from "@/data/siteConfig";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { TrackedLink } from "./TrackedLink";

export async function ContactDetails() {
  const settings = await getSiteSettings();
  const tel = telUrl(settings.phone);
  const wa = whatsappUrl(undefined, settings.whatsapp);

  return (
    <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-2">
      <div>
        <h2 className="font-serif text-2xl">{settings.name}</h2>
        {settings.location.formattedAddress ? (
          <div className="mt-3 text-sm text-muted leading-relaxed">
            {settings.location.formattedAddress.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </div>
        ) : settings.location.address ? (
          <p className="mt-3 text-sm text-muted leading-relaxed">
            {settings.location.address}
          </p>
        ) : null}
      </div>

      <ul className="space-y-3 text-sm">
        {tel ? (
          <li>
            <span className="text-muted">Phone — </span>
            <TrackedLink href={tel} event="phone_click" location="contact" className="link-underline">
              {settings.phone}
            </TrackedLink>
          </li>
        ) : (
          <li className="text-muted">Phone — set NEXT_PUBLIC_PHONE</li>
        )}
        {settings.email ? (
          <li>
            <span className="text-muted">Email — </span>
            <TrackedLink href={`mailto:${settings.email}`} event="email_click" location="contact" className="link-underline">
              {settings.email}
            </TrackedLink>
          </li>
        ) : (
          <li className="text-muted">Email — set NEXT_PUBLIC_EMAIL</li>
        )}
        <li>
          <span className="text-muted">Instagram — </span>
          <a
            href={settings.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            @{settings.instagram.handle}
          </a>
        </li>
        {wa ? (
          <li>
            <span className="text-muted">WhatsApp — </span>
            <TrackedLink href={wa} event="whatsapp_click" location="contact" target="_blank" rel="noopener noreferrer" className="link-underline">
              Chat with us
            </TrackedLink>
          </li>
        ) : null}
        {settings.location.googleMapsUrl ? (
          <li>
            <a
              href={settings.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-[0.6875rem] uppercase tracking-[0.2em]"
            >
              View on Google Maps
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
