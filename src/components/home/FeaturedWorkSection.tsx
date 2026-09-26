import Image from "next/image";
import {
  featuredWorkIds,
  portfolioItems,
  type PortfolioItem,
} from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";
import { siteConfig } from "@/data/siteConfig";

const layoutClasses: Record<
  NonNullable<PortfolioItem["layout"]>,
  string
> = {
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  standard: "",
  detail: "md:col-span-1",
};

export function FeaturedWorkSection() {
  const items = featuredWorkIds
    .map((id) => portfolioItems.find((p) => p.id === id))
    .filter(Boolean) as PortfolioItem[];

  return (
    <section className="section-padding mx-auto max-w-[1400px] py-20 md:py-28">
      <Reveal>
        <SectionHeading title={"STORIES WE'VE CAPTURED"} align="center" />
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 md:auto-rows-[180px] lg:auto-rows-[220px]">
        {items.map((item, i) => (
          <Reveal
            key={item.id}
            delay={i * 50}
            className={`relative overflow-hidden ${layoutClasses[item.layout ?? "standard"]} ${
              i === 0 ? "col-span-2 row-span-2 min-h-[280px] md:min-h-0" : "min-h-[160px] md:min-h-0"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <ButtonLink href={siteConfig.secondaryCta.href} variant="outline">
          View Full Portfolio
        </ButtonLink>
      </div>
    </section>
  );
}
