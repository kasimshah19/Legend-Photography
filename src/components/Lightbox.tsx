"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { PortfolioItem } from "@/data/portfolio";
type LightboxProps = {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const item = items[index];
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onNext, onPrev],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleKey]);

  if (!item) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:right-8 md:top-8"
        aria-label="Close lightbox"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 top-1/2 z-[110] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 md:left-8 md:h-14 md:w-14"
        aria-label="Previous image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 top-1/2 z-[110] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 md:right-8 md:h-14 md:w-14"
        aria-label="Next image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className="relative flex h-full w-full max-w-6xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container - takes all remaining space */}
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Bottom Bar: Text */}
        <div className="mt-4 flex-none w-full flex flex-col gap-4 pb-safe">
          <div className="flex items-end justify-between gap-4 text-white px-4 md:px-0">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {item.category.replace("-", " ")}
              </p>
            </div>
            <p className="text-xs text-white/50">
              {index + 1} / {items.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
