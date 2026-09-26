"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  portfolioItems,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/data/portfolio";
import { PortfolioFilter } from "@/components/PortfolioFilter";
import { Lightbox } from "@/components/Lightbox";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const spanClass = (item: PortfolioItem, i: number) => {
  if (item.layout === "wide") return "md:col-span-2";
  if (item.layout === "tall") return "md:row-span-2";
  if (i % 5 === 0) return "md:col-span-2 md:row-span-2";
  return "";
};

export function PortfolioGallery() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("category") as PortfolioCategory | "all") ?? "all";
  const validCategories = [
    "all",
    "wedding",
    "pre-wedding",
    "candid",
    "maternity",
    "portrait",
    "fashion",
    "events",
  ] as const;
  const safeInitial = validCategories.includes(initial as (typeof validCategories)[number])
    ? (initial as PortfolioCategory | "all")
    : "all";

  const [filter, setFilter] = useState<PortfolioCategory | "all">(safeInitial);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? portfolioItems
        : portfolioItems.filter((p) => p.category === filter),
    [filter],
  );

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex((p) => p.id === id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <>
      <div className="section-padding mx-auto max-w-[1400px] py-10 md:py-14">
        <PortfolioFilter active={filter} onChange={setFilter} />
      </div>

      <div className="section-padding mx-auto max-w-[1400px] pb-20">
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:auto-rows-[300px]"
          role="list"
        >
          {filtered.map((item, i) => {
            // Editorial aspect ratios based on layout
            const aspectRatioClass = 
              item.layout === "wide" ? "aspect-[16/9] md:aspect-auto md:h-full" : 
              item.layout === "tall" ? "aspect-[3/4] md:aspect-auto md:h-full" : 
              "aspect-square md:aspect-auto md:h-full";
            
            // Grid spanning
            let gridSpan = "";
            if (item.layout === "wide") gridSpan = "md:col-span-2 md:row-span-1 lg:col-span-2";
            else if (item.layout === "tall") gridSpan = "md:col-span-1 md:row-span-2";
            else gridSpan = "md:col-span-1 md:row-span-1";

            return (
              <Reveal 
                key={item.id} 
                className={cn("masonry-item", gridSpan)}
                variant={i % 3 === 0 ? "zoom" : i % 2 === 0 ? "up" : "scale"}
                delay={(i % 4) * 50}
              >
                <div className="group relative w-full h-full block overflow-hidden text-left bg-muted">
                  <div className={cn("relative w-full", aspectRatioClass)}>
                    <button
                      type="button"
                      onClick={() => openLightbox(item.id)}
                      className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      aria-label={`View ${item.title} fullscreen`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                    </button>
                    
                    <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-white/80">
                        {item.category.replace("-", " ")}
                      </span>
                      <span className="mt-2 font-serif text-2xl text-white">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted">No images in this category yet.</p>
        ) : null}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i - 1 + filtered.length) % filtered.length,
            )
          }
          onNext={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i + 1) % filtered.length,
            )
          }
        />
      ) : null}
    </>
  );
}
