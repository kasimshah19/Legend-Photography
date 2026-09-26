"use client";

import { useState } from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding mx-auto max-w-[1400px] py-20 md:py-32">
      <Reveal>
        <SectionHeading title="CLIENT STORIES" align="center" />
      </Reveal>

      {testimonials.some((t) => t.isPlaceholder) ? (
        <p className="mx-auto mt-4 max-w-lg text-center text-xs text-muted">
          Demo placeholders — replace with verified client testimonials in{" "}
          <code className="text-[0.65rem]">src/data/testimonials.ts</code>.
        </p>
      ) : null}

      <div className="mt-12 relative overflow-hidden bg-foreground text-white">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          
          {/* Image Side */}
          <div className="relative w-full md:w-1/2 h-[450px] md:h-full overflow-hidden">
            {testimonials.map((item, i) => (
                 <Image
                 key={item.id}
                 src={item.image}
                 alt={item.name}
                 fill
                 sizes="(max-width: 768px) 100vw, 50vw"
                 className={`object-cover transition-all duration-1000 ease-in-out ${
                   i === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                 }`}
                 priority={i === 0}
               />
            ))}
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Content Side */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-neutral-950">
             <div className="max-w-md w-full relative">
                {/* Large Quotes Icon */}
                <span className="absolute -top-12 -left-8 text-8xl text-white/5 font-serif select-none pointer-events-none">
                  &ldquo;
                </span>
                
                {/* Crossfading Text Container */}
                <div className="relative min-h-[350px] md:min-h-[300px] w-full flex items-center">
                  {testimonials.map((item, i) => (
                    <div 
                      key={item.id} 
                      className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${
                        i === currentIndex 
                          ? "opacity-100 translate-y-0 z-10" 
                          : "opacity-0 translate-y-4 z-0 pointer-events-none"
                      }`}
                    >
                      <p className="font-serif text-[clamp(1.25rem,3vw,1.75rem)] leading-relaxed font-light text-white/90">
                        {item.quote}
                      </p>
                      <div className="mt-8 border-t border-white/10 pt-6">
                        <p className="text-sm md:text-base font-medium tracking-wide uppercase text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/50">
                          {item.eventType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center gap-4">
                  <button 
                    onClick={handlePrev}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all hover:scale-105"
                    aria-label="Previous Testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all hover:scale-105"
                    aria-label="Next Testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
