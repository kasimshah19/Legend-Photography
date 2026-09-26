"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioItem } from "@/data/portfolio";
import { Lightbox } from "@/components/Lightbox";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const spanClass = (item: PortfolioItem, i: number) => {
  if (item.layout === "wide") return "md:col-span-2";
  if (item.layout === "tall") return "md:row-span-2";
  if (i % 5 === 0) return "md:col-span-2 md:row-span-2";
  return "";
};

export function AlbumGallery({ items }: { items: PortfolioItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="section-padding mx-auto max-w-[1400px] py-20">
        <div
          className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
          role="list"
        >
          {items.map((item, i) => (
            <Reveal 
              key={item.id} 
              className={cn("masonry-item", spanClass(item, i))}
              variant={i % 3 === 0 ? "zoom" : i % 2 === 0 ? "up" : "scale"}
              delay={(i % 4) * 50}
            >
              <button
                type="button"
                role="listitem"
                onClick={() => setLightboxIndex(i)}
                className="group relative w-full h-full block overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`View ${item.title} fullscreen`}
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i - 1 + items.length) % items.length,
            )
          }
          onNext={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i + 1) % items.length,
            )
          }
        />
      ) : null}
    </>
  );
}
