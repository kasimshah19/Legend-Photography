import Image from "next/image";
import { contactData } from "@/data/contact";
import { Reveal } from "@/components/Reveal";

export function PhotographerStory() {
  const { photographer } = contactData;

  return (
    <section className="bg-[#121212] py-20 md:py-32 text-white">
      <div className="section-padding mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <Reveal variant="left" className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={photographer.image}
              alt={`${photographer.name}, ${photographer.role}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal variant="right" className="flex flex-col justify-center">
            <span className="mb-4 block text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] text-accent">
              Behind the Lens
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              {photographer.name}
            </h2>
            <p className="text-white/60 tracking-[0.2em] uppercase text-xs md:text-sm mb-10 border-b border-white/20 pb-8">
              {photographer.role}
            </p>
            <div className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-relaxed">
              {photographer.story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
