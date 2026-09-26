import { siteConfig, telUrl, whatsappUrl } from "@/data/siteConfig";

export function ContactDetails() {
  const tel = telUrl();
  const wa = whatsappUrl();

  const locationLine = [siteConfig.location.city, siteConfig.location.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-2">
      <div>
        <h2 className="font-serif text-2xl">{siteConfig.name}</h2>
        {locationLine ? (
          <p className="mt-3 text-sm text-muted">{locationLine}</p>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Location — add city/state in{" "}
            <code className="text-xs">siteConfig</code> when verified.
          </p>
        )}
        {siteConfig.location.address ? (
          <p className="mt-2 text-sm text-muted">{siteConfig.location.address}</p>
        ) : null}
      </div>

      <ul className="space-y-3 text-sm">
        {tel ? (
          <li>
            <span className="text-muted">Phone — </span>
            <a href={tel} className="link-underline">
              {siteConfig.phone}
            </a>
          </li>
        ) : (
          <li className="text-muted">Phone — set NEXT_PUBLIC_PHONE</li>
        )}
        {siteConfig.email ? (
          <li>
            <span className="text-muted">Email — </span>
            <a href={`mailto:${siteConfig.email}`} className="link-underline">
              {siteConfig.email}
            </a>
          </li>
        ) : (
          <li className="text-muted">Email — set NEXT_PUBLIC_EMAIL</li>
        )}
        <li>
          <span className="text-muted">Instagram — </span>
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            @{siteConfig.instagram.handle}
          </a>
        </li>
        {wa ? (
          <li>
            <span className="text-muted">WhatsApp — </span>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline">
              Chat with us
            </a>
          </li>
        ) : null}
        {siteConfig.location.googleMapsUrl ? (
          <li>
            <a
              href={siteConfig.location.googleMapsUrl}
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
