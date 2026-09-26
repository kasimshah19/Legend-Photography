import { processSteps } from "@/data/services";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function ProcessTimeline() {
  return (
    <section className="border-t border-border bg-[#f0ede8] py-20 md:py-28">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <SectionHeading title="HOW IT WORKS" align="center" />
        </Reveal>

        <ol className="mt-20 md:mt-28 grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-8 relative">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-[11px] left-0 w-full h-[1px] bg-border/80"></div>
          
          {/* Vertical Line (Mobile) */}
          <div className="block md:hidden absolute top-0 left-[11px] h-full w-[1px] bg-border/80"></div>
          
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 100} variant="up" className="relative z-10">
              <li className="relative flex flex-col pl-10 md:pl-0 md:pt-10 group cursor-default">
                
                {/* Connector Dot */}
                <div className="absolute top-[8px] left-[8px] md:top-[8px] md:left-0 w-2 h-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150 shadow-[0_0_0_8px_#f0ede8]"></div>
                
                <span className="font-serif text-5xl md:text-6xl text-accent opacity-30 transition-opacity duration-500 group-hover:opacity-100 mb-4 md:mb-6 block leading-none">
                  {step.step}
                </span>
                
                <div>
                  <h3 className="mb-3 text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-foreground transition-colors duration-500 group-hover:text-accent">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="max-w-xs text-sm text-muted leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
