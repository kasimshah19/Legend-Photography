"use client";

import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/data/siteConfig";
import { ButtonLink } from "@/components/ButtonLink";
import { cn } from "@/lib/cn";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const wa = whatsappUrl("Hi Legend Photography, I'd like to enquire about a shoot.");

  return (
    <div
      id="mobile-menu"
      className={cn(
        "fixed inset-0 z-40 overflow-hidden xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <nav
        className={cn(
          "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-background px-6 py-24 transition-transform duration-500 ease-out overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <ul className="flex flex-col gap-6">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="font-serif text-2xl text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl text-foreground"
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
                className="font-serif text-2xl text-foreground"
              >
                WhatsApp
              </a>
            </li>
          ) : null}
        </ul>
        <div className="mt-auto pt-8">
          <ButtonLink href={siteConfig.primaryCta.href} className="w-full">
            {siteConfig.primaryCta.label}
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
