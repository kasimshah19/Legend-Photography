"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    },
    { dependencies: [pathname], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="invisible" style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
