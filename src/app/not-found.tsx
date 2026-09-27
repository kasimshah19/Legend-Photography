import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Page Not Found | Legend Photography",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <>
      <Navbar variant="dark" />
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 py-32 text-center">
        <Reveal variant="up">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            404 Error
          </span>
          <h1 className="font-serif text-5xl text-foreground md:text-7xl">
            Page Not Found.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-muted">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/" variant="primary">
              Back to Home
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">
              View Portfolio
            </ButtonLink>
          </div>
        </Reveal>
      </main>
    </>
  );
}
