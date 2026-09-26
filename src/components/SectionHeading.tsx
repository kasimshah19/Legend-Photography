import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center mx-auto max-w-3xl",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.28em]",
            dark ? "text-white/70" : "text-muted",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.15] tracking-tight whitespace-pre-line",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-xl text-base leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            dark ? "text-white/75" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
