import Link from "next/link";
import { isPlaceholder } from "@/data/site";

type Variant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  /** Force treating the link as external (opens in a new tab). */
  external?: boolean;
  /** Add the `download` attribute (for files served from /public). */
  download?: boolean;
  className?: string;
  "aria-label"?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-2",
  secondary:
    "border border-border bg-surface text-fg hover:border-accent/40 hover:bg-surface-2",
  ghost: "text-muted hover:text-fg",
};

/**
 * A link styled as a button. Handles internal routes, external links
 * (new tab), file downloads, and not-yet-available placeholder links.
 */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  download,
  className = "",
  "aria-label": ariaLabel,
}: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  // Placeholder links are rendered as a clearly disabled control rather
  // than pointing at a guessed URL.
  if (isPlaceholder(href)) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title="Link coming soon"
        className={`${classes} cursor-not-allowed opacity-50`}
      >
        {children}
      </span>
    );
  }

  const isExternal =
    external || /^https?:\/\//.test(href) || href.startsWith("mailto:");
  const showArrow = isExternal && !download && href.startsWith("http");

  if (isExternal || download) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(download ? { download: true } : {})}
        {...(isExternal && !download
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
        {showArrow && (
          <span aria-hidden="true" className="text-xs">
            ↗
          </span>
        )}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
