import { PLACEHOLDER } from "@/data/site";

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
  },
  {
    slug: "recursive-descent-parser",
    title: "MiniCalc — Recursive Descent Parser & REPL",
    type: "Programming language / interpreter project",
    summary:
      "A purely functional interpreter for a custom expression language, built in Scala 3. A two-phase recursive descent parser builds an AST from algebraic data types, a pure evaluator threads an immutable environment for let-bindings and conditionals, and an interactive REPL runs it all — with type-safe, Either-based error handling throughout.",
    stack: [
      "Scala 3",
      "sbt",
      "ScalaTest",
      "Recursive descent parsing",
      "Algebraic data types",
      "Pattern matching",
      "REPL design",
    ],
    highlights: [
      "Two-phase parser (tokenizer → recursive descent) that resolves operator precedence and associativity across arithmetic, comparison, and logical operators.",
      "Language modeled as algebraic data types — sealed traits and case classes give an AST with exhaustive, compiler-checked pattern matching.",
      "Pure-functional evaluator that threads an immutable environment for let-bindings, conditionals, and variable shadowing.",
      "Type-safe Either-based error handling (no exceptions for control flow) with clear undefined-variable, divide-by-zero, and type-mismatch messages.",
    ],
    repoUrl: "https://github.com/cgarland-dev/MiniCalc",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
