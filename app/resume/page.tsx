import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import TechBadge from "@/components/TechBadge";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Christopher Garland — Software Developer. Technical skills, education, professional experience at CDW, and software projects.",
};

const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Languages", skills: ["Python", "Scala", "SQL"] },
  {
    label: "Frameworks & libraries",
    skills: ["Streamlit", "SQLAlchemy", "Plotly", "Cats Effect", "Pytest", "ScalaTest"],
  },
  {
    label: "Tooling & practices",
    skills: [
      "Git",
      "GitHub Actions",
      "Ruff",
      "ETL & data modeling",
      "Recursive descent parsing",
      "Concurrency & scheduling",
      "REPL design",
      "Automated testing",
    ],
  },
  {
    label: "Systems & hardware",
    skills: [
      "Server-rack builds",
      "Hardware assembly",
      "Device configuration",
      "Troubleshooting",
      "Process validation",
    ],
  },
];

const experienceBullets = [
  "Build large server racks for data-center deployments, from hardware assembly through device configuration.",
  "Execute automation and testing, and troubleshoot hardware and configuration issues.",
  "Validate process steps and prepare completed builds for packaging and shipment.",
  "Recently promoted to Tech Level Two.",
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading as="h1" eyebrow="Resume">
          {site.name}
        </SectionHeading>
        <ButtonLink
          href={site.resumePdf}
          variant="primary"
          download
          className="print:hidden"
        >
          Download PDF
        </ButtonLink>
      </div>
      <p className="mt-3 text-muted">
        {site.role} | {site.location}
      </p>

      <div className="mt-12 space-y-12">
        {/* Summary */}
        <section aria-labelledby="summary-heading">
          <SectionHeading as="h2" id="summary-heading">
            Summary
          </SectionHeading>
          <p className="mt-4 leading-relaxed text-muted">
            Software Development graduate with hands-on technical systems
            experience. Currently builds large server racks for data-center
            deployments and was recently promoted to Tech Level Two, with
            day-to-day work in hardware assembly, device configuration,
            automation, testing, troubleshooting, and process validation.
            Builds practical software on the side — a Python production-chain
            tool and a Scala 3 interpreter that grew into a Cats Effect
            task-orchestration runtime — with an emphasis on correct logic,
            clean data modeling, concurrency, and tests.
          </p>
        </section>

        {/* Technical Skills */}
        <section aria-labelledby="skills-heading">
          <SectionHeading as="h2" id="skills-heading">
            Technical Skills
          </SectionHeading>
          <dl className="mt-4 grid gap-6 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <dt className="text-sm font-semibold uppercase tracking-wider text-fg">
                  {group.label}
                </dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li key={skill}>
                        <TechBadge>{skill}</TechBadge>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Education */}
        <section aria-labelledby="education-heading">
          <SectionHeading as="h2" id="education-heading">
            Education
          </SectionHeading>
          <div className="mt-4">
            <h3 className="font-semibold text-fg">Software Development</h3>
            <p className="text-muted">Graduate</p>
            <p className="mt-1 text-sm italic text-muted/70">
              Institution and graduation year — to be added.
            </p>
          </div>
        </section>

        {/* Professional Experience */}
        <section aria-labelledby="experience-heading">
          <SectionHeading as="h2" id="experience-heading">
            Professional Experience
          </SectionHeading>
          <div className="mt-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-semibold text-fg">CDW — Tech Level Two</h3>
              <p className="text-sm text-muted">
                Sep 2024 – Present | {site.location}
              </p>
            </div>
            <p className="mt-3 leading-relaxed text-muted">
              Build large server racks for data-center deployments, including
              hardware assembly, device configuration, testing, automation
              execution, troubleshooting, packaging, and shipment preparation.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-accent">
              {experienceBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section aria-labelledby="resume-projects-heading">
          <SectionHeading as="h2" id="resume-projects-heading">
            Projects
          </SectionHeading>
          <div className="mt-4 space-y-6">
            {projects.map((project) => (
              <div key={project.slug}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold text-fg">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted">{project.type}</p>
                </div>
                <p className="mt-2 leading-relaxed text-muted">
                  {project.summary}
                </p>
                <p className="mt-2 text-sm">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    View project details →
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
