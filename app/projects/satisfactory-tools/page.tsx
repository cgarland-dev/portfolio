import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailLayout, {
  DetailSection,
  ProjectLinksSection,
  ScreenshotPlaceholder,
} from "@/components/ProjectDetailLayout";
import { getProject } from "@/data/projects";

const project = getProject("satisfactory-tools");

export const metadata: Metadata = {
  title: "Satisfactory Tools",
  description:
    "A factory-planning tool for Satisfactory: a recursive production-chain calculator over a normalized SQLite/SQLAlchemy database, with a multipage Streamlit UI, Plotly Sankey diagrams, Pytest coverage, Ruff, and GitHub Actions CI.",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-2">
      {children}
    </code>
  );
}

const listClass = "list-disc space-y-2 pl-5 marker:text-accent";

export default function SatisfactoryToolsPage() {
  if (!project) notFound();

  return (
    <ProjectDetailLayout project={project}>
      <DetailSection id="overview" title="Project overview" eyebrow="Overview">
        <p>
          Satisfactory Tools is a factory-planning application for the game
          Satisfactory — but the interesting part is the engineering underneath
          it. It turns the game&apos;s raw data into a normalized relational
          database, computes full production chains with a recursive algorithm,
          and presents everything through a multipage Streamlit interface backed
          by SQLAlchemy.
        </p>
        <p>
          The aim was a tool that stays correct as recipes, alternate recipes,
          byproducts, building counts, and power requirements interact — the kind
          of state space where a spreadsheet quickly stops being trustworthy.
        </p>
      </DetailSection>

      <DetailSection id="problem" title="Problem it solves" eyebrow="Problem">
        <p>
          Satisfactory production planning becomes complex when recipes,
          alternate recipes, resource nodes, factory groups, byproducts, power
          usage, and bottlenecks interact. This project was built to turn that
          complexity into a tool that can calculate production chains and track
          factory-level resource balance.
        </p>
        <p>
          A naive calculation falls apart because items share dependencies and
          recipe graphs can fold back on themselves. The chain has to be walked
          carefully — aggregating shared sub-totals and guarding against cycles —
          rather than expanded blindly.
        </p>
      </DetailSection>

      <DetailSection id="features" title="Main features" eyebrow="Features">
        <ul className={listClass}>
          <li>
            <span className="text-fg">Production calculator with three modes:</span>{" "}
            forward (item + target rate → full chain, power draw, and a Sankey
            view), reverse (given input materials → maximum achievable output
            with suggestions), and max-output (identify the bottleneck material
            for a factory group).
          </li>
          <li>
            <span className="text-fg">Recipe browser and item explorer</span>{" "}
            across the game&apos;s full catalog of items and recipes.
          </li>
          <li>
            <span className="text-fg">Factory dashboard</span> with global
            metrics — groups, production lines, buildings, power, and raw
            materials — and modal-based CRUD for groups, production lines, and
            resource nodes.
          </li>
          <li>
            <span className="text-fg">Alternate-recipe switching</span> via a{" "}
            <Code>preferred_recipes</Code> mapping, so the same calculation can
            be re-run against different recipe choices.
          </li>
          <li>
            <span className="text-fg">Quality-of-life tooling:</span> belt-tier
            overflow warnings, extractor auto-fill from in-game extraction
            tables, and JSON import/export for sharing group configurations.
          </li>
        </ul>
      </DetailSection>

      <DetailSection
        id="implementation"
        title="Technical implementation"
        eyebrow="Engineering"
      >
        <p>
          The codebase follows a layered design that keeps the calculation logic
          independent of the UI. Concerns are separated across modules:
        </p>
        <ul className={listClass}>
          <li>
            <Code>etl.py</Code> — parses the game&apos;s <Code>Docs.json</Code>{" "}
            into a normalized schema.
          </li>
          <li>
            <Code>database.py</Code> — SQLAlchemy 2.x ORM entities, relationships,
            and session management.
          </li>
          <li>
            <Code>calculator.py</Code> — the recursive, pure-functional
            production-chain logic.
          </li>
          <li>
            <Code>queries.py</Code> — read-only database access.
          </li>
          <li>
            <Code>production.py</Code> — CRUD operations and metric aggregation.
          </li>
        </ul>
        <p>
          The heart of the tool is <Code>calculate_chain</Code>, which walks the
          recipe graph recursively and aggregates per-subtree totals — raw
          materials, byproducts, building counts, and power — while a visited set
          guards against cycles. It returns totals instead of mutating shared
          state, which keeps it behaving like a pure function.
        </p>
        <p>
          A couple of data-modeling details mattered: recipe display names
          aren&apos;t unique because alternates share a name, so everything is
          keyed by <Code>recipe_id</Code>; and item forms are serialized as
          strings rather than Python enums so Streamlit&apos;s Arrow-based
          dataframes don&apos;t choke on them. Plotly Sankey diagrams render the
          material flow, <Code>st.session_state</Code> persists UI state across
          reruns, and <Code>@st.cache_data</Code> memoizes read-only queries. A
          pre-built database is committed so the ETL step can be skipped on first
          run.
        </p>
      </DetailSection>

      <DetailSection id="screenshots" title="Screenshots" eyebrow="Screenshots">
        <p>Screenshots will be added here. Placeholders for now:</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ScreenshotPlaceholder label="Production calculator — forward mode" />
          <ScreenshotPlaceholder label="Sankey diagram of a production chain" />
          <ScreenshotPlaceholder label="Factory dashboard — global metrics" />
          <ScreenshotPlaceholder label="Recipe browser / item explorer" />
        </div>
      </DetailSection>

      <DetailSection
        id="testing"
        title="Testing and quality"
        eyebrow="Quality"
      >
        <ul className={listClass}>
          <li>
            <span className="text-fg">Pytest</span> suite runs against an
            in-memory SQLite database, so tests carry no external dependencies
            and stay fast.
          </li>
          <li>
            <span className="text-fg">Calculator coverage</span> targets the
            math that&apos;s easy to get wrong: clock-speed rounding, byproducts,
            alternate-recipe switching, and subtree totals.
          </li>
          <li>
            <span className="text-fg">Data-layer coverage</span> includes
            create / rename / delete cascades, import/export round-trips, and
            summary rollups.
          </li>
          <li>
            <span className="text-fg">Ruff</span> handles linting, and{" "}
            <span className="text-fg">GitHub Actions</span> runs the test suite
            and lint on every push and pull request.
          </li>
        </ul>
      </DetailSection>

      <DetailSection id="learned" title="What I learned" eyebrow="Reflection">
        <p>
          This project reinforced the importance of keeping calculation logic
          separate from UI state. The production-chain calculator is easier to
          test and reason about when it behaves like a pure function, especially
          when recursive recipe dependencies, alternate recipes, byproducts, and
          bottlenecks interact.
        </p>
      </DetailSection>

      <ProjectLinksSection project={project} />
    </ProjectDetailLayout>
  );
}
