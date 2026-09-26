import Link from "next/link";
import { siteConfig, whatsappUrl, telUrl } from "@/data/siteConfig";

export function Footer() {
  const wa = whatsappUrl();
  const tel = telUrl();

  return (
    <footer className="border-t border-border bg-background">
      <div className="section-padding mx-auto grid max-w-[1400px] gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-2">
          <p className="font-serif text-xl tracking-wide">{siteConfig.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Creative photography for weddings, pre-weddings, portraits and
            celebrations — crafted with an editorial eye and a candid heart.
          </p>

          <div className="mt-8 flex items-center gap-4">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-accent hover:bg-accent/5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted transition-colors group-hover:text-accent">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            )}
            <a href={siteConfig.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-accent hover:bg-accent/5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted transition-colors group-hover:text-accent">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {siteConfig.youtube.url && (
              <a href={siteConfig.youtube.url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="group flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-accent hover:bg-accent/5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted transition-colors group-hover:text-accent">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-muted">
            Navigate
          </p>
          <ul className="mt-4 space-y-2">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-muted">
            Connect
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Instagram
              </a>
            </li>
            {wa ? (
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            {tel ? (
              <li>
                <a href={tel} className="transition-colors hover:text-accent">
                  {siteConfig.phone}
                </a>
              </li>
            ) : (
              <li className="text-muted">Phone — configure in .env</li>
            )}
            {siteConfig.email ? (
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.email}
                </a>
              </li>
            ) : (
              <li className="text-muted">Email — configure in .env</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="section-padding mx-auto flex max-w-[1400px] flex-col gap-2 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Crafted for portfolio, trust &amp; inquiry.</p>
        </div>
      </div>
    </footer>
  );
}
