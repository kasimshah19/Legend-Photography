import { packages } from "@/data/services";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export function PackageComparison() {
  return (
    <section className="bg-[#fcfbf9] py-24 md:py-32" id="packages">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Investment
            </span>
            <SectionHeading title="CURATED PACKAGES" align="center" />
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              We offer structured collections designed to tell your story completely, with the flexibility to customize based on your unique celebration.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {packages.map((pkg, index) => {
            const isPopular = pkg.badge !== null;

            return (
              <Reveal
                key={pkg.id}
                delay={index * 150}
                variant="up"
                className={`relative flex flex-col p-8 md:p-12 transition-all duration-700 ease-out hover:-translate-y-3 hover:shadow-2xl ${
                  isPopular
                    ? "bg-foreground text-background shadow-xl scale-100 md:scale-105 z-10"
                    : "bg-white text-foreground border border-border/60 shadow-lg shadow-black/5"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-6 py-1.5 text-[10px] font-bold tracking-[0.25em] text-white uppercase shadow-md whitespace-nowrap">
                    {pkg.badge}
                  </div>
                )}

                <div className="mb-8 text-center">
                  <h3 className={`font-serif text-3xl md:text-4xl ${isPopular ? 'text-white' : 'text-foreground'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`mt-4 text-sm leading-relaxed ${isPopular ? 'text-white/70' : 'text-muted'} h-[60px] flex items-center justify-center`}>
                    {pkg.positioning}
                  </p>
                </div>

                <div className={`my-8 border-t pt-8 flex-grow ${isPopular ? 'border-white/20' : 'border-border/60'}`}>
                  <ul className="flex flex-col gap-5 text-sm">
                    <li className="flex items-start gap-4">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-accent' : 'text-accent'}`} />
                      <span className={isPopular ? 'text-white/90' : 'text-foreground/80'}>{pkg.hours}</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-accent' : 'text-accent'}`} />
                      <span className={isPopular ? 'text-white/90' : 'text-foreground/80'}>{pkg.photos}</span>
                    </li>
                    {pkg.album && (
                      <li className="flex items-start gap-4">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-accent' : 'text-accent'}`} />
                        <span className={isPopular ? 'text-white/90' : 'text-foreground/80'}>{pkg.album}</span>
                      </li>
                    )}
                    {pkg.video && (
                      <li className="flex items-start gap-4">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-accent' : 'text-accent'}`} />
                        <span className={isPopular ? 'text-white/90' : 'text-foreground/80'}>{pkg.video}</span>
                      </li>
                    )}
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-accent' : 'text-accent'}`} />
                        <span className={isPopular ? 'text-white/90' : 'text-foreground/80'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`mt-auto pt-8 border-t ${isPopular ? 'border-white/20' : 'border-border/60'}`}>
                  <div className="mb-8 flex flex-col items-center justify-center">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 ${isPopular ? 'text-white/50' : 'text-muted'}`}>
                      Starting From
                    </span>
                    <span className={`text-2xl font-serif ${isPopular ? 'text-white' : 'text-foreground'}`}>
                      {pkg.priceLabel}
                    </span>
                  </div>
                  
                  <a
                    href={`/contact?package=${pkg.id}`}
                    className={`flex w-full items-center justify-center border px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-500 ${
                      isPopular
                        ? "border-accent bg-accent text-white hover:bg-transparent hover:text-accent"
                        : "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {pkg.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
