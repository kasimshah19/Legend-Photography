import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/data/siteConfig";

type CTASectionProps = {
  compact?: boolean;
};

export function CTASection({ compact }: CTASectionProps) {
  return (
    <section
      className={
        compact
          ? "border-t border-border py-16"
          : "relative overflow-hidden py-24 md:py-32"
      }
    >
      {!compact ? (
        <div className="absolute inset-0 bg-foreground" aria-hidden />
      ) : null}
      <div
        className={`section-padding relative mx-auto max-w-[1400px] text-center ${
          compact ? "" : "text-white"
        }`}
      >
        <Reveal>
          {!compact && (
            <p className="mb-4 text-[0.65rem] font-light uppercase tracking-[0.4em] text-white/50">
              Limited Slots Available
            </p>
          )}
          <h2 className={`font-serif leading-tight ${compact ? "text-[clamp(1.75rem,4vw,3rem)]" : "text-[clamp(2.5rem,6vw,5rem)] font-light tracking-wide"}`}>
            {compact
              ? "Ready to begin?"
              : "Book Your Date\nNow."}
          </h2>
          <p
            className={`mx-auto mt-6 max-w-xl text-sm md:text-base leading-relaxed ${
              compact ? "text-muted" : "text-white/60 font-light"
            }`}
          >
            {compact
              ? "Tell us about your celebration and we'll guide you through the next steps."
              : "Your story deserves the perfect frames. Let's create something beautiful together before our calendar fills up."}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <ButtonLink
              href={siteConfig.primaryCta.href}
              variant={compact ? "primary" : "outline-light"}
            >
              Book a Shoot
            </ButtonLink>
            <WhatsAppButton
              className={compact ? "" : "!border-white/20 !bg-white/5 !text-white hover:!bg-white hover:!text-black backdrop-blur-md"}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
