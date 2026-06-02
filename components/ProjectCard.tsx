import type { Project } from "@/data/projects";
import ButtonLink from "@/components/ButtonLink";
import TechBadge from "@/components/TechBadge";

type ProjectCardProps = {
  project: Project;
  /** How many highlights to show on the card. */
  maxHighlights?: number;
};

export default function ProjectCard({
  project,
  maxHighlights = 4,
}: ProjectCardProps) {
  const { slug, title, type, summary, stack, highlights, repoUrl } = project;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-fg">
          <a
            href={`/projects/${slug}`}
            className="transition-colors hover:text-accent"
          >
            {title}
          </a>
        </h3>
        <p className="mt-1 text-sm text-muted">{type}</p>

        <p className="mt-4 text-sm leading-relaxed text-muted">{summary}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
          {stack.map((tech) => (
            <li key={tech}>
              <TechBadge>{tech}</TechBadge>
            </li>
          ))}
        </ul>

        <ul className="mt-5 space-y-2 text-sm text-muted">
          {highlights.slice(0, maxHighlights).map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span className="leading-relaxed">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={`/projects/${slug}`} variant="primary">
          View Project
        </ButtonLink>
        <ButtonLink
          href={repoUrl}
          variant="secondary"
          aria-label={`View source code for ${title}`}
        >
          View Code
        </ButtonLink>
      </div>
    </article>
  );
}
