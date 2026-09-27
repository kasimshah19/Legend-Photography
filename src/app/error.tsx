"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/Reveal";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service here
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar variant="dark" />
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 py-32 text-center">
        <Reveal variant="up">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            System Error
          </span>
          <h1 className="font-serif text-5xl text-foreground md:text-7xl">
            Something went wrong.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-muted">
            We apologize for the inconvenience. An unexpected error has occurred while loading this page.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button 
              onClick={() => reset()} 
              className="btn-primary"
            >
              Try Again
            </button>
            <ButtonLink href="/" variant="outline">
              Back to Home
            </ButtonLink>
          </div>
        </Reveal>
      </main>
    </>
  );
}
