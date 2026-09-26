"use client";

import { portfolioCategories } from "@/data/portfolio";
import type { PortfolioCategory } from "@/data/portfolio";
import { cn } from "@/lib/cn";

type PortfolioFilterProps = {
  active: PortfolioCategory | "all";
  onChange: (category: PortfolioCategory | "all") => void;
};

export function PortfolioFilter({ active, onChange }: PortfolioFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2 md:gap-3"
      role="tablist"
      aria-label="Filter portfolio by category"
    >
      {portfolioCategories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={cn(
              "border px-4 py-2 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              isActive
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-transparent text-muted hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
