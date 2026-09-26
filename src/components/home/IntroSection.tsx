import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function IntroSection() {
  return (
    <section className="section-padding mx-auto max-w-[1400px] py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
            <Image
              src="/images/intro/studio-story.jpg"
              alt="Legend Photography creative studio work"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-muted">
            Introduction
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
            WE CAPTURE MOMENTS,
            <br />
            NOT JUST PHOTOGRAPHS.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            Legend Photography is a creative photography studio specializing in
            weddings, pre-weddings, portraits, maternity and special occasions.
          </p>
          <Link
            href="/services"
            className="link-underline mt-8 inline-block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-foreground"
          >
            Know Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
