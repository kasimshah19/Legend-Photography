import { whyChooseUs } from "@/data/specialities";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function WhySection() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <SectionHeading title="WHY LEGEND PHOTOGRAPHY?" align="center" />
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.number} delay={i * 80} variant={i % 2 === 0 ? "left" : "up"}>
              <div className="border-t border-foreground/20 pt-6">
                <span className="font-serif text-3xl text-accent">{item.number}</span>
                <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
