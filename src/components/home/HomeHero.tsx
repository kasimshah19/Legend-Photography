"use client";

import { useState, useRef, useEffect } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { siteConfig } from "@/data/siteConfig";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const VIDEOS = [
  "/videos/hero-bg-unique.mp4", 
  "/videos/hero-bg-2-unique.mp4",
  "/videos/couple-3.mp4",
  "/videos/couple-4.mp4",
  "/videos/couple-5.mp4",
  "/videos/couple-6.mp4",
  "/videos/couple-7.mp4"
];

export function HomeHero() {
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [indices, setIndices] = useState<[number, number]>([0, 1]);
  const [isMuted, setIsMuted] = useState(true);

  const player0 = useRef<HTMLVideoElement>(null);
  const player1 = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".hero-elem", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2, // Tiny delay to ensure smooth initial load
    });
  }, { scope: containerRef });

  useEffect(() => {
    // Initial play
    if (activePlayer === 0) player0.current?.play().catch(() => {});
    else player1.current?.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (player0.current) player0.current.muted = isMuted;
    if (player1.current) player1.current.muted = isMuted;
  }, [isMuted]);

  const handleEnded = (player: 0 | 1) => {
    const nextPlayer = player === 0 ? 1 : 0;
    setActivePlayer(nextPlayer);
    
    // Instantly play the next video
    const nextRef = nextPlayer === 0 ? player0 : player1;
    if (nextRef.current) {
      nextRef.current.currentTime = 0;
      nextRef.current.play().catch(() => {});
    }

    // Load the next-next video in the background after a tiny delay
    setTimeout(() => {
      setIndices((prev) => {
        const newIndices = [...prev] as [number, number];
        newIndices[player] = (prev[nextPlayer] + 1) % VIDEOS.length;
        return newIndices;
      });
    }, 400);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getVideoClass = () => {
    return "absolute top-1/2 left-1/2 w-[100vh] h-[100vw] -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover object-[center_30%]";
  };

  return (
    <section ref={containerRef} className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-black">
        {/* Player 0 */}
        <video
          ref={player0}
          src={VIDEOS[indices[0]]}
          muted={isMuted}
          playsInline
          preload="auto"
          onEnded={() => handleEnded(0)}
          className={`${getVideoClass()} transition-opacity duration-300 ${
            activePlayer === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
        {/* Player 1 */}
        <video
          ref={player1}
          src={VIDEOS[indices[1]]}
          muted={isMuted}
          playsInline
          preload="auto"
          onEnded={() => handleEnded(1)}
          className={`${getVideoClass()} transition-opacity duration-300 ${
            activePlayer === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
        
        {/* Toggle Sound Button */}
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

      <div className="section-padding relative z-10 mx-auto w-full max-w-[1400px] pb-16 pt-32 md:pb-24 md:pt-40">
        <p className="hero-elem text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-white/80">
          {siteConfig.name.toUpperCase()}
        </p>
        <h1 className="hero-elem mt-4 max-w-4xl font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08] text-white">
          Stories That Deserve
          <br />
          To Be Remembered.
        </h1>
        <div className="hero-elem mt-8 flex flex-wrap items-center gap-2 md:gap-3">
          {["Wedding", "Pre-Wedding", "Candid", "Maternity", "Fashion", "Events"].map((item) => (
            <span 
              key={item} 
              className="cursor-default rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.55rem] font-light uppercase tracking-[0.3em] text-white/90 shadow-xl backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white md:px-5 md:py-2 md:text-[0.65rem]"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="hero-elem mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href={siteConfig.secondaryCta.href} variant="outline-light">
            Explore Our Work
          </ButtonLink>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 md:flex"
        aria-hidden
      >
        <span className="text-[0.625rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-10 w-px animate-pulse bg-white/40" />
      </div>
    </section>
  );
}
