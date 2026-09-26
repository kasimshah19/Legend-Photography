import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outline-light";
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonLinkProps) {
  const classes = cn(
    variant === "primary" && "btn-primary",
    variant === "outline" && "btn-outline text-foreground border-foreground/30",
    variant === "outline-light" && "btn-outline btn-outline-light",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
