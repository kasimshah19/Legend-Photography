"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/cn";
import { MobileMenu } from "@/components/MobileMenu";
import { ButtonLink } from "@/components/ButtonLink";

type NavbarProps = {
  variant?: "light" | "dark";
};

export function Navbar({ variant = "dark" }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHero = variant === "dark" && !scrolled;
  const solid = scrolled || variant === "light";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-border bg-background/90 backdrop-blur-md py-4"
            : "border-b border-transparent bg-transparent py-6 md:py-8",
        )}
      >
        <div className="section-padding mx-auto flex max-w-[1400px] items-center justify-between gap-6">
          <Link
            href="/"
            className={cn(
              "font-serif text-lg tracking-[0.08em] uppercase transition-colors md:text-xl",
              onHero ? "text-white" : "text-foreground",
            )}
          >
            {siteConfig.name}
          </Link>

          <nav
            className="hidden items-center gap-10 xl:flex"
            aria-label="Main navigation"
          >
            {siteConfig.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "link-underline text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors",
                    onHero
                      ? active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : active
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              href={siteConfig.primaryCta.href}
              variant={onHero ? "outline-light" : "primary"}
              className="hidden !px-5 !py-3 text-[0.6875rem] sm:inline-flex"
            >
              {siteConfig.primaryCta.label}
            </ButtonLink>

            <button
              type="button"
              className={cn(
                "relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 xl:hidden",
                onHero ? "text-white" : "text-foreground",
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className={cn(
                  "block h-px w-6 bg-current transition-transform",
                  menuOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-current transition-opacity",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-current transition-transform",
                  menuOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
