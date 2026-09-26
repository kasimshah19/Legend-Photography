import Image from "next/image";
import { portfolioItems } from "@/data/portfolio";
import { siteConfig } from "@/data/siteConfig";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";

const instagramPreview = portfolioItems.slice(0, 6);

export function InstagramSection() {
  return (
    <section className="bg-foreground py-20 text-white md:py-28">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <SectionHeading
            title="FOLLOW OUR LATEST STORIES"
            subtitle={`@${siteConfig.instagram.handle}`}
            align="center"
            dark
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {instagramPreview.map((item, i) => (
            <Reveal key={item.id} delay={i * 40} variant="scale">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink
            href={siteConfig.instagram.url}
            variant="outline-light"
            external
          >
            Follow on Instagram
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
