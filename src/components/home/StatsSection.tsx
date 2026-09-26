"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useIntersectionObserver(ref: React.RefObject<any>, options: IntersectionObserverInit & { once?: boolean }) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.once && currentRef) {
          observer.unobserve(currentRef);
        }
      }
    }, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

function Counter({ end, suffix = "", duration = 2.5, formatK = false }: { end: number, suffix?: string, duration?: number, formatK?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1, once: true });

  useEffect(() => {
    if (isInView) {
      const startTime = performance.now();
      
      const updateCounter = (currentTime: number) => {
        const elapsedTime = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // easeOutExpo for a cinematic slow-down at the end
        const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeOutProgress * end));
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView, end, duration]);

  const displayCount = formatK 
    ? (count === end ? "10K" : count.toLocaleString()) 
    : count.toLocaleString();

  return (
    <span ref={ref}>
      {displayCount}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="border-b border-border bg-background py-10 md:py-16">
      <div className="section-padding mx-auto max-w-[1200px]">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            
            <div className="flex flex-col items-center justify-center py-8 md:py-0">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                <Counter end={1400} suffix="+" />
              </span>
              <span className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-muted">Beautiful Shoots</span>
            </div>

            <div className="flex flex-col items-center justify-center py-8 md:py-0">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                <Counter end={10000} suffix="+" formatK={true} />
              </span>
              <span className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-muted">Instagram Followers</span>
            </div>

            <div className="flex flex-col items-center justify-center py-8 md:py-0">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                <Counter end={5} suffix="+" duration={1.5} />
              </span>
              <span className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-muted">Years of Experience</span>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
