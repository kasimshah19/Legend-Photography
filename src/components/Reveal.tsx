"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: "up" | "down" | "left" | "right" | "scale" | "zoom" | "fade";
  delay?: number;
};

export function Reveal({ children, className, variant = "up", delay = 0 }: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Define animation properties based on variant
      const fromVars: gsap.TweenVars = { autoAlpha: 0 };
      const toVars: gsap.TweenVars = {
        autoAlpha: 1,
        duration: 0.8,
        delay: delay / 1000,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%", // Trigger when the top of the element hits 90% from the top of the viewport
          toggleActions: "play none none none", // Play once
        },
      };

      if (variant === "up") {
        fromVars.y = 50;
        toVars.y = 0;
      } else if (variant === "down") {
        fromVars.y = -50;
        toVars.y = 0;
      } else if (variant === "left") {
        fromVars.x = -50;
        toVars.x = 0;
      } else if (variant === "right") {
        fromVars.x = 50;
        toVars.x = 0;
      } else if (variant === "scale") {
        fromVars.scale = 0.9;
        toVars.scale = 1;
      } else if (variant === "zoom") {
        fromVars.scale = 1.1; // Zoom out effect for images
        toVars.scale = 1;
        toVars.ease = "power3.out";
        toVars.duration = 1.2;
      } else if (variant === "fade") {
        // Just opacity
      }

      gsap.fromTo(el, fromVars, toVars);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={cn("gsap-reveal", className)} suppressHydrationWarning>
      {children}
    </div>
  );
}
