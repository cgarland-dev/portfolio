import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { site, mailto } from "@/data/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 text-lg font-medium text-accent sm:text-xl">
            Software Developer | Technical Systems &amp; Tooling
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            I build practical software tools backed by hands-on technical
            systems experience, including data-center rack builds, device
            configuration, automation testing, troubleshooting, and software
            projects involving Python, Scala, SQL, parsing, and
            production-chain calculation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects" variant="primary">
              View Projects
            </ButtonLink>
            <ButtonLink href={site.resumePdf} variant="secondary" download>
              Download Resume
            </ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <ButtonLink href={site.github} variant="ghost" className="px-0">
              GitHub
            </ButtonLink>
            <ButtonLink href={site.linkedin} variant="ghost" className="px-0">
              LinkedIn
            </ButtonLink>
            <ButtonLink href={mailto} variant="ghost" className="px-0">
              Email
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        aria-labelledby="about-heading"
        className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <SectionHeading as="h2" id="about-heading" eyebrow="About">
          Background
        </SectionHeading>

        <div className="mt-6 grid gap-10 md:grid-cols-3">
          <div className="space-y-4 text-base leading-relaxed text-muted md:col-span-2">
            <p>
              I&apos;m a Software Development graduate who builds practical tools
              and works hands-on with technical systems. My current role centers
              on building large server racks for data-center deployments, where I
              recently was promoted to Tech Level Two. That work keeps me close
              to real hardware, device configuration, and the kind of testing and
              process validation that production environments demand.
            </p>
            <p>
              On the software side, my interests are in tooling, backend logic,
              parsing, data modeling, and automation. I&apos;m drawn to problems
              where careful structure pays off: a calculator that has to stay
              correct under recursion, a parser that has to follow a grammar, or
              a data layer that has to round-trip cleanly.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-fg">
                Hands-on systems work
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {[
                  "Large server-rack builds & hardware assembly",
                  "Device configuration",
                  "Testing & automation execution",
                  "Troubleshooting & process validation",
                  "Packing & shipment preparation",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-fg">
                Software focus
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {[
                  "Tooling & backend logic",
                  "Parsing & data modeling",
                  "Automation & practical applications",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section
        aria-labelledby="projects-heading"
        className="border-t border-border bg-surface/30"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading as="h2" id="projects-heading" eyebrow="Work">
            Featured Projects
          </SectionHeading>
          <p className="mt-3 max-w-2xl text-muted">
            Two projects that show how I approach real software: correct logic,
            clean data, and tooling that holds up.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Resume CTA */}
      <section
        aria-labelledby="resume-cta-heading"
        className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <h2
            id="resume-cta-heading"
            className="text-2xl font-bold tracking-tight text-fg"
          >
            Looking for the resume version?
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Download the PDF or view the resume page for a structured summary of
            skills, education, and experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={site.resumePdf} variant="primary" download>
              Download Resume
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              View Resume
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
