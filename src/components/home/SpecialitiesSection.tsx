import Image from "next/image";
import Link from "next/link";
import { specialities } from "@/data/specialities";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function SpecialitiesSection() {
  return (
    <section className="border-y border-border bg-[#f0ede8] py-20 md:py-28">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <SectionHeading title="OUR SPECIALITIES" />
        </Reveal>

        <div className="mt-14 space-y-6 md:space-y-8">
          {specialities.map((item, index) => (
            <Reveal key={item.number} delay={index * 60} variant={index % 2 === 0 ? "left" : "right"}>
              <Link
                href={item.href}
                className="group grid overflow-hidden border border-border/80 bg-background md:grid-cols-12"
              >
                <div
                  className={`relative min-h-[220px] md:min-h-[280px] ${
                    index % 2 === 0 ? "md:col-span-7 md:order-1" : "md:col-span-7 md:col-start-6 md:order-2"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} by Legend Photography`}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div
                  className={`flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 ${
                    index % 2 === 0 ? "md:col-span-5 md:order-2" : "md:col-span-5 md:order-1"
                  }`}
                >
                  <span className="text-[0.6875rem] tracking-[0.25em] text-accent">
                    {item.number}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="link-underline mt-6 inline-block w-fit text-[0.6875rem] uppercase tracking-[0.22em]">
                    View work
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
