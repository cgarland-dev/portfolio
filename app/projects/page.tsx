import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects by Christopher Garland, including a Python production-chain calculator and a Scala recursive descent parser with a custom REPL.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading as="h1" eyebrow="Projects">
        Things I&apos;ve built
      </SectionHeading>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        A focused set of projects centered on correct logic, clean data
        modeling, and practical tooling. Each one is backed by tests and real
        engineering, not just a demo.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
