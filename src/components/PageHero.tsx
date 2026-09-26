"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  videos?: string[];
};

export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
  eyebrow,
  videos,
}: PageHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [indices, setIndices] = useState<[number, number]>([0, 1]);
  const [isMuted, setIsMuted] = useState(true);

  const player0 = useRef<HTMLVideoElement>(null);
  const player1 = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    gsap.from(".hero-elem", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (videos && videos.length > 0) {
      if (activePlayer === 0) player0.current?.play().catch(() => {});
      else player1.current?.play().catch(() => {});
    }
  }, [videos, activePlayer]);

  useEffect(() => {
    if (player0.current) player0.current.muted = isMuted;
    if (player1.current) player1.current.muted = isMuted;
  }, [isMuted]);

  const handleEnded = (player: 0 | 1) => {
    if (!videos) return;
    const nextPlayer = player === 0 ? 1 : 0;
    setActivePlayer(nextPlayer);
    
    const nextRef = nextPlayer === 0 ? player0 : player1;
    if (nextRef.current) {
      nextRef.current.currentTime = 0;
      nextRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setIndices((prev) => {
        const newIndices = [...prev] as [number, number];
        newIndices[player] = (prev[nextPlayer] + 1) % videos.length;
        return newIndices;
      });
    }, 1000);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const getVideoClass = (isActive: boolean) => {
    return `absolute top-1/2 left-1/2 w-[100vh] h-[100vw] -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover object-[center_30%] transition-opacity duration-1000 ease-in-out ${
      isActive ? "opacity-100 z-10" : "opacity-0 z-0 transition-all delay-700"
    }`;
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative flex items-end overflow-hidden min-h-[100svh]"
      )}
    >
      {videos && videos.length > 0 ? (
        <div className="absolute inset-0 bg-black">
          <video
            ref={player0}
            src={videos[indices[0]]}
            muted={isMuted}
            playsInline
            autoPlay={activePlayer === 0}
            preload={activePlayer === 0 ? "auto" : "metadata"}
            onEnded={() => handleEnded(0)}
            className={getVideoClass(activePlayer === 0)}
          />
          <video
            ref={player1}
            src={videos[indices[1] % videos.length]}
            muted={isMuted}
            playsInline
            autoPlay={activePlayer === 1}
            preload={activePlayer === 1 ? "auto" : "metadata"}
            onEnded={() => handleEnded(1)}
            className={getVideoClass(activePlayer === 1)}
          />
          
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center gap-1.5 rounded-full bg-black/20 hover:bg-black/40 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/30 shadow-2xl"
            aria-label={isMuted ? "Play Sound" : "Mute Sound"}
          >
            {isMuted ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span>Play</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Muted</span>
              </>
            )}
          </button>

          <div
            className="absolute inset-0"
            style={{ background: "var(--hero-overlay)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
        </div>
      ) : image ? (
        <>
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--hero-overlay)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
        </>
      ) : (
        <div className="absolute inset-0 bg-foreground" />
      )}
      <div className="section-padding relative z-10 mx-auto w-full max-w-[1400px] pb-16 pt-32 md:pb-24 md:pt-40">
        {eyebrow ? (
          <p className="hero-elem text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-white/80">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="hero-elem mt-4 max-w-4xl font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08] text-white">
          {title}
        </h1>
        {subtitle ? (
          <p className="hero-elem mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg whitespace-pre-line">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div
        className="hero-elem absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 md:flex"
        aria-hidden
      >
        <span className="text-[0.625rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-10 w-px animate-pulse bg-white/40" />
      </div>
    </section>
  );
}
