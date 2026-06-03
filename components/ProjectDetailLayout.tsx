import Link from "next/link";
import { type Project, projects } from "@/data/projects";
import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import TechBadge from "@/components/TechBadge";
import { isPlaceholder } from "@/data/site";

type ProjectDetailLayoutProps = {
  project: Project;
  children: React.ReactNode;
};

/** Shared chrome for a project detail page: header, stack, and actions. */
export default function ProjectDetailLayout({
  project,
  children,
}: ProjectDetailLayoutProps) {
  const { title, type, summary, stack, repoUrl, demoUrl } = project;

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next =
    idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <a
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden="true">←</span> Projects
      </a>

      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          {type}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {stack.map((tech) => (
            <li key={tech}>
              <TechBadge>{tech}</TechBadge>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={repoUrl} variant="primary">
            View Code
          </ButtonLink>
          {demoUrl && (
            <ButtonLink href={demoUrl} variant="secondary">
              Live Demo
            </ButtonLink>
          )}
        </div>
      </header>

      <div className="mt-14 space-y-14">{children}</div>

      {(prev || next) && (
        <nav
          aria-label="More projects"
          className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex-1 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="text-xs text-muted">← Previous project</span>
              <span className="mt-1 block font-medium text-fg transition-colors group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex-1 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40 sm:text-right"
            >
              <span className="text-xs text-muted">Next project →</span>
              <span className="mt-1 block font-medium text-fg transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" aria-hidden="true" />
          )}
        </nav>
      )}
    </div>
  );
}

type DetailSectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

/** A titled prose section with consistent spacing and an accessible label. */
export function DetailSection({
  id,
  title,
  eyebrow,
  children,
}: DetailSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <SectionHeading as="h2" id={`${id}-heading`} eyebrow={eyebrow}>
        {title}
      </SectionHeading>
      <div className="mt-4 space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/** The "Links" section, rendered consistently from project data. */
export function ProjectLinksSection({ project }: { project: Project }) {
  const { repoUrl, demoUrl } = project;
  return (
    <DetailSection id="links" title="Links">
      <dl className="space-y-3">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-fg">Source code:</dt>
          <dd>
            {isPlaceholder(repoUrl) ? (
              <span className="text-muted/70">Coming soon</span>
            ) : (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {repoUrl.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-fg">Live demo:</dt>
          <dd>
            {demoUrl ? (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {demoUrl.replace(/^https?:\/\//, "")} ↗
              </a>
            ) : (
              <span className="text-muted/70">Not currently deployed</span>
            )}
          </dd>
        </div>
      </dl>
    </DetailSection>
  );
}

/** A placeholder block standing in for a screenshot to be added later. */
export function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 p-6 text-center">
      <span className="text-sm text-muted/70">{label}</span>
    </div>
  );
}
