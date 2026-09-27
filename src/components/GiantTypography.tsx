"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TypographyContent = () => (
  <span className="flex flex-col items-center justify-center leading-[0.85] w-full">
    <span className="block text-[clamp(5rem,15vw,22rem)] tracking-[-0.04em]">LEGEND</span>
    <span className="block text-[clamp(2.2rem,6.5vw,9.5rem)] tracking-[0.05em] font-light mt-[0.04em]">PHOTOGRAPHY</span>
  </span>
);

export function GiantTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryFillRef = useRef<HTMLSpanElement>(null);
  const secondaryFillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !primaryFillRef.current || !secondaryFillRef.current) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const container = containerRef.current;
    const primary = primaryFillRef.current;
    const secondary = secondaryFillRef.current;

    const ctx = gsap.context(() => {
      if (mediaQuery.matches) {
        // Reduced motion: static beautiful state
        gsap.set([primary, secondary], { 
          opacity: 0, 
          "--x": "50", 
          "--y": "50" 
        });
        gsap.set(primary, { opacity: 0.3 }); // Just a subtle static fill
        return;
      }

      // Desktop premium cursor interaction (Art-Directed) & Mobile Tap
      
      // Primary and Secondary are both updated DIRECTLY in pointer event handlers
      // for 1:1 absolute minimal latency. NO GSAP interpolation for X/Y coordinates.

      let isActive = false;
      let fadeOutTimer: ReturnType<typeof setTimeout>;
      let docLeft = 0;
      let docTop = 0;

      const updateBounds = () => {
        const r = container.getBoundingClientRect();
        docLeft = r.left + window.scrollX;
        docTop = r.top + window.scrollY;
      };
      updateBounds();

      const handlePointerEnter = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        isActive = true;
        updateBounds();
        // Snappy enter activation
        gsap.to(secondary, { opacity: 0.5, duration: 0.15, ease: "power2.out" });
        gsap.to(primary, { opacity: 1, duration: 0.1, ease: "power2.out" });
      };

      const handlePointerLeave = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        isActive = false;
        // Fast, elegant decay
        gsap.to(primary, { opacity: 0, duration: 0.2, ease: "power2.out" });
        gsap.to(secondary, { opacity: 0, duration: 0.3, ease: "power2.out" });
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        if (!isActive) return;
        
        const relX = e.pageX - docLeft;
        const relY = e.pageY - docTop;
        
        // DIRECT update. No GSAP, no RAF, no lerp. 1:1 with pointer.
        primary.style.setProperty("--x", relX.toString());
        primary.style.setProperty("--y", relY.toString());
        secondary.style.setProperty("--x", relX.toString());
        secondary.style.setProperty("--y", relY.toString());
      };

      const handlePointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        
        clearTimeout(fadeOutTimer);
        updateBounds();
        
        const relX = e.pageX - docLeft;
        const relY = e.pageY - docTop;

        // Move immediately with zero lag
        primary.style.setProperty("--x", relX.toString());
        primary.style.setProperty("--y", relY.toString());
        secondary.style.setProperty("--x", relX.toString());
        secondary.style.setProperty("--y", relY.toString());
        
        // Fast activate
        gsap.to(secondary, { opacity: 0.5, duration: 0.15, ease: "power2.out" });
        gsap.to(primary, { opacity: 1, duration: 0.1, ease: "power2.out" });
        
        // Gentle fade out after a hold timeout
        fadeOutTimer = setTimeout(() => {
          gsap.to(primary, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
          gsap.to(secondary, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
        }, 2000);
      };

      const handleGlobalPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        if (container.contains(e.target as Node)) return;
        clearTimeout(fadeOutTimer);
        gsap.to(primary, { opacity: 0, duration: 0.25, ease: "power2.out" });
        gsap.to(secondary, { opacity: 0, duration: 0.35, ease: "power2.out" });
      };

      window.addEventListener("resize", updateBounds);
      container.addEventListener("pointerenter", handlePointerEnter);
      container.addEventListener("pointerleave", handlePointerLeave);
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointerdown", handleGlobalPointerDown);

      return () => {
        window.removeEventListener("resize", updateBounds);
        container.removeEventListener("pointerenter", handlePointerEnter);
        container.removeEventListener("pointerleave", handlePointerLeave);
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointerdown", handleGlobalPointerDown);
        clearTimeout(fadeOutTimer);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1600px] px-4 py-16 group cursor-default overflow-hidden flex justify-center"
      aria-hidden="true"
    >
      <h2 className="relative flex flex-col items-center justify-center font-serif uppercase leading-none select-none text-center">
        
        {/* Base Layer - Idle State: Visible, elegant, subtle fill and stroke */}
        <span 
          className="transition-colors duration-1000 text-[#a89f91]/15 group-hover:text-[#a89f91]/25"
          style={{ WebkitTextStroke: '1px rgba(170, 155, 140, 0.65)' }}
        >
          <TypographyContent />
        </span>
        
        {/* Secondary Layer (The Memory/Inertia Trail) */}
        <span 
          ref={secondaryFillRef}
          className="absolute inset-0 opacity-0 pointer-events-none flex flex-col items-center justify-center"
          style={{ 
            '--x': '500', 
            '--y': '100',
            WebkitMaskImage: 'radial-gradient(circle clamp(200px, 25vw, 450px) at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
            maskImage: 'radial-gradient(circle clamp(200px, 25vw, 450px) at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
          } as React.CSSProperties}
        >
          <span 
            className="block w-full h-full bg-gradient-to-r from-[#2a1a12] via-[#4a2612] to-[#5c3016] bg-clip-text text-transparent"
            style={{ WebkitTextStroke: '1.2px #7a4628' }}
          >
            <TypographyContent />
          </span>
        </span>

        {/* Primary Layer (The Hot Core / Spotlight) */}
        <span 
          ref={primaryFillRef}
          className="absolute inset-0 opacity-0 pointer-events-none flex flex-col items-center justify-center"
          style={{ 
            '--x': '500', 
            '--y': '100',
            WebkitMaskImage: 'radial-gradient(circle clamp(120px, 15vw, 250px) at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, rgba(0,0,0,0.85) 25%, transparent 60%)',
            maskImage: 'radial-gradient(circle clamp(120px, 15vw, 250px) at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, rgba(0,0,0,0.85) 25%, transparent 60%)',
          } as React.CSSProperties}
        >
          <span 
            className="block w-full h-full bg-gradient-to-br from-[#5c3716] via-[#a65d29] to-[#c97a3e] bg-clip-text text-transparent"
            style={{ WebkitTextStroke: '1.5px #e69d65' }}
          >
            <TypographyContent />
          </span>
        </span>
      </h2>
    </div>
  );
}
