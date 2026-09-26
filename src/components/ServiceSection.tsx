import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/Reveal";
import type { ServiceItem } from "@/data/services";

type ServiceSectionProps = {
  service: ServiceItem;
  index: number;
};

export function ServiceSection({ service, index }: ServiceSectionProps) {
  const reversed = index % 2 === 1;

  return (
    <Reveal variant={reversed ? "left" : "right"}>
      <article
        className={`grid items-center gap-10 border-b border-border py-16 md:grid-cols-2 md:gap-16 md:py-20 ${
          reversed ? "" : ""
        }`}
      >
        <div className={reversed ? "md:order-2" : ""}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className={reversed ? "md:order-1" : ""}>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
            {service.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            {service.description}
          </p>

          {service.features && service.features.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
                What we cover:
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1 w-1 bg-accent/60 block rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.cta ? (
            <div className="mt-10">
              <ButtonLink href={service.cta.href} variant="outline">
                {service.cta.label}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
