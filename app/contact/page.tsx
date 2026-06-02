import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import { site, mailto, isPlaceholder } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Christopher Garland — email, GitHub, and LinkedIn. Based in the Chicago-area, IL.",
};

type ContactRow = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const rows: ContactRow[] = [
  { label: "Email", value: site.email, href: mailto },
  {
    label: "GitHub",
    value: site.github.replace(/^https?:\/\//, ""),
    href: site.github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: isPlaceholder(site.linkedin) ? "Coming soon" : site.linkedin,
    href: isPlaceholder(site.linkedin) ? undefined : site.linkedin,
    external: true,
  },
  { label: "Location", value: site.location },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading as="h1" eyebrow="Contact">
        Get in touch
      </SectionHeading>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The fastest way to reach me is by email. I&apos;m open to software
        development roles and technical work — feel free to reach out.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={mailto} variant="primary">
          Email me
        </ButtonLink>
        <ButtonLink href={site.github} variant="secondary">
          GitHub
        </ButtonLink>
      </div>

      <dl className="mt-12 divide-y divide-border rounded-xl border border-border bg-surface">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt className="text-sm font-semibold uppercase tracking-wider text-muted">
              {row.label}
            </dt>
            <dd className="text-fg">
              {row.href ? (
                <a
                  href={row.href}
                  className="text-accent underline-offset-4 hover:underline"
                  {...(row.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {row.value}
                  {row.external && (
                    <span aria-hidden="true" className="ml-1 text-xs">
                      ↗
                    </span>
                  )}
                </a>
              ) : (
                <span
                  className={
                    row.value === "Coming soon" ? "text-muted/70" : "text-fg"
                  }
                >
                  {row.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
