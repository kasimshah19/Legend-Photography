"use client";

import Image from "next/image";
import { useState } from "react";
import { films } from "@/data/films";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function FilmsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (films.length === 0) return null;

  return (
    <section className="bg-background py-20 md:py-32">
      <div className="section-padding mx-auto max-w-[1400px]">
        <SectionHeading
          title="FILMS / REELS"
          subtitle="Watch some of our favourite stories in motion."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {films.map((film, i) => (
            <Reveal key={film.id} variant="up" delay={i * 100}>
              <div className="group relative w-full overflow-hidden bg-muted/20">
                <div className="relative aspect-video w-full">
                  {activeVideo === film.id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
                      title={film.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveVideo(film.id)}
                      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center focus-visible:outline-accent"
                      aria-label={`Play ${film.title}`}
                    >
                      <Image
                        src={film.thumbnail}
                        alt={film.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50" />
                      
                      {/* Play Button */}
                      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                        <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 text-left">
                        <h3 className="font-serif text-xl md:text-2xl text-white">{film.title}</h3>
                        {film.category && (
                          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/70">
                            {film.category.replace("-", " ")} Film
                          </p>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
