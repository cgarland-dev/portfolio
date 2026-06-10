export type Project = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  stack: string[];
  highlights: string[];
  repoUrl: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "satisfactory-tools",
    title: "Satisfactory Tools",
    type: "Factory-planning tool / production calculator",
    summary:
      "A factory-planning application for Satisfactory that calculates production chains, tracks resource nodes and factory groups, visualizes item flows, and manages production data through a Streamlit + SQLite/SQLAlchemy tool.",
    stack: [
      "Python",
      "Streamlit",
      "SQLite",
      "SQLAlchemy",
      "Plotly",
      "Pytest",
      "Ruff",
      "GitHub Actions",
    ],
    highlights: [
      "Recursive production-chain calculator computes item rates, raw materials, byproducts, building counts, and power totals — implemented as a pure function with cycle-safe traversal.",
      "ETL pipeline parses the game's Docs.json into a normalized relational schema modeled with SQLAlchemy 2.x ORM entities.",
      "Multipage Streamlit app with recipe browsing, item exploration, a production calculator, and a factory dashboard.",
      "Plotly Sankey diagrams visualize material flow; Pytest, Ruff, and GitHub Actions CI keep the math and data layer honest.",
    ],
    repoUrl: "https://github.com/cgarland-dev/satisfactory-tools",
    demoUrl: "https://satisfactory-tools.streamlit.app/",
  },
  {
    slug: "taskview",
    title: "TaskView — Interpreter & Task-Orchestration Runtime",
    type: "Language interpreter & concurrency runtime (Scala 3)",
    summary:
      "A Scala 3 project that began as a purely functional expression interpreter — a hand-written recursive descent parser, an ADT-based AST, and a pure, type-checked evaluator — and grew into a task-orchestration runtime: typed tasks with priorities, dependencies, timeouts, and retries; a dependency-aware scheduler with cycle detection; and concurrent execution on Cats Effect fibers, all driven from an interactive REPL.",
    stack: [
      "Scala 3",
      "Cats Effect",
      "sbt",
      "ScalaTest",
      "Recursive descent parsing",
      "Algebraic data types",
      "Concurrency (fibers)",
      "Topological scheduling",
    ],
    highlights: [
      "Hand-written two-phase recursive descent parser (tokenizer → AST) that resolves operator precedence and associativity — no parser generator.",
      "Pure, type-checked evaluator over an ADT AST with Either-based errors and an immutable, threaded environment; an effectful evalIO handles task expressions.",
      "Task orchestration: typed tasks with priorities, dependencies, timeouts, and linear/exponential retries, composed into sequences, parallels, and workflows.",
      "Dependency-aware topological scheduler (Kahn's algorithm + cycle detection) feeding a Cats Effect fiber execution engine, with execution statistics.",
    ],
    repoUrl: "https://github.com/cgarland-dev/TaskView",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
