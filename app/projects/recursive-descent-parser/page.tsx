import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailLayout, {
  DetailSection,
  ProjectLinksSection,
} from "@/components/ProjectDetailLayout";
import CodeBlock from "@/components/CodeBlock";
import { getProject } from "@/data/projects";

const project = getProject("recursive-descent-parser");

export const metadata: Metadata = {
  title: "MiniCalc — Recursive Descent Parser & REPL",
  description:
    "A purely functional interpreter for a custom expression language in Scala 3: a two-phase recursive descent parser, an AST built from algebraic data types, a pure evaluator with immutable environments, Either-based error handling, and an interactive REPL.",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-2">
      {children}
    </code>
  );
}

const listClass = "list-disc space-y-2 pl-5 marker:text-accent";

type ReplLine = { kind: "info" | "in" | "out" | "err"; text: string };

const replSession: ReplLine[] = [
  { kind: "info", text: "Welcome to MiniCalc!" },
  { kind: "info", text: "Type :help for help, :quit to exit" },
  { kind: "in", text: "5 + 3 * 2" },
  { kind: "out", text: "11.0" },
  { kind: "in", text: "let x = 10 in x + 5" },
  { kind: "out", text: "15.0" },
  { kind: "in", text: "if 10 > 5 then 100 else 200" },
  { kind: "out", text: "100.0" },
  { kind: "in", text: "(5 + 3) * 2 > 10 && true" },
  { kind: "out", text: "true" },
  { kind: "in", text: "x + 5" },
  { kind: "err", text: "Error: Undefined variable: x." },
  { kind: "in", text: "10 / 0" },
  { kind: "err", text: "Error: Cannot divide by zero: division by zero." },
];

const replColor: Record<ReplLine["kind"], string> = {
  info: "text-muted",
  in: "text-fg",
  out: "text-[#7ee787]",
  err: "text-[#ff7b72]",
};

const parseBinaryOpSig = `// One generic function handles every precedence level,
// with the correct associativity, by delegating to the
// parser for the next-tighter-binding level.
def parseBinaryOp(
  tokens: List[Token],
  operators: Set[String],
  nextParser: List[Token] => Either[ParseError, (Expr, List[Token])],
  opMap: String => BinaryOp
): Either[ParseError, (Expr, List[Token])]`;

export default function RecursiveDescentParserPage() {
  if (!project) notFound();

  return (
    <ProjectDetailLayout project={project}>
      <DetailSection id="overview" title="Project overview" eyebrow="Overview">
        <p>
          MiniCalc is a purely functional interpreter for a small expression
          language, written in Scala 3. It began as a functional-programming
          course project and grew into a clean end-to-end pipeline: source text
          is tokenized, parsed into an abstract syntax tree by a recursive
          descent parser, and evaluated by a pure function that threads an
          immutable environment. An interactive REPL ties the pieces together.
        </p>
        <p>
          The language is small but real — numbers and booleans, variables,
          arithmetic, comparisons, logical operators, <Code>let</Code> bindings,
          and <Code>if/then/else</Code> conditionals — which is enough surface
          area to exercise precedence, scope, and type checking properly.
        </p>
      </DetailSection>

      <DetailSection
        id="why"
        title="Why recursive descent parsing matters"
        eyebrow="Approach"
      >
        <p>
          Recursive descent is parsing that mirrors the grammar directly: each
          grammar rule becomes a function, and the call structure follows the
          structure of the language. Operator precedence and associativity stop
          being abstract — they fall out of the order in which the parsing
          functions call one another, from the loosest-binding operators down to
          parentheses and literals.
        </p>
        <p>
          Doing it by hand, rather than reaching for a parser generator, is the
          difference between knowing what &ldquo;precedence&rdquo; means and
          having actually implemented it. It also keeps the parser readable and
          debuggable: there&apos;s no generated black box between the grammar and
          the code.
        </p>
        <p className="text-sm">Operator precedence, highest to lowest:</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm marker:text-accent">
          <li>
            Parentheses: <Code>( … )</Code>
          </li>
          <li>
            Multiplication, division: <Code>*</Code> <Code>/</Code>
          </li>
          <li>
            Addition, subtraction: <Code>+</Code> <Code>-</Code>
          </li>
          <li>
            Comparisons: <Code>{"< > <= >= == !="}</Code>
          </li>
          <li>
            Logical AND: <Code>&amp;&amp;</Code>
          </li>
          <li>
            Logical OR: <Code>||</Code>
          </li>
        </ol>
      </DetailSection>

      <DetailSection id="features" title="Features" eyebrow="Features">
        <ul className={listClass}>
          <li>
            <span className="text-fg">Expression language</span> with numeric and
            boolean literals, variables, arithmetic, comparison, and logical
            operators.
          </li>
          <li>
            <span className="text-fg">
              <Code>let</Code> bindings and conditionals
            </span>{" "}
            — e.g. <Code>let x = 10 in x * 2</Code> and{" "}
            <Code>if x &gt; 5 then 100 else 200</Code> — with proper lexical
            scope and variable shadowing.
          </li>
          <li>
            <span className="text-fg">Interactive REPL</span> with commands:{" "}
            <Code>:help</Code>, <Code>:env</Code> (list bindings),{" "}
            <Code>:clear</Code>, and <Code>:quit</Code>.
          </li>
          <li>
            <span className="text-fg">Helpful, typed errors</span> for undefined
            variables, division by zero, and type mismatches.
          </li>
        </ul>
      </DetailSection>

      <DetailSection
        id="repl"
        title="Example REPL session"
        eyebrow="In action"
      >
        <CodeBlock label="$ sbt run">
          {replSession.map((line, i) => (
            <span key={i}>
              {line.kind === "in" && (
                <span className="text-accent">{"> "}</span>
              )}
              <span className={replColor[line.kind]}>{line.text}</span>
              {"\n"}
            </span>
          ))}
        </CodeBlock>
        <p className="text-sm">
          Values evaluate to <Code>Double</Code> or <Code>Boolean</Code>, and
          errors are returned as values rather than thrown — so the REPL can
          print them cleanly and keep going.
        </p>
      </DetailSection>

      <DetailSection
        id="implementation"
        title="Technical implementation"
        eyebrow="Engineering"
      >
        <p>
          Parsing happens in two phases — tokenization (<Code>String</Code> →{" "}
          <Code>List[Token]</Code>) followed by recursive descent parsing (
          <Code>List[Token]</Code> → <Code>Expr</Code>). The language itself is
          modeled as algebraic data types: a sealed <Code>Expr</Code> trait with
          case classes for each construct, which lets the evaluator pattern-match
          exhaustively with the compiler checking for completeness.
        </p>
        <ul className={listClass}>
          <li>
            <span className="text-fg">Pure evaluator:</span> recursively
            pattern-matches on the AST, threading an immutable{" "}
            <Code>Environment</Code> for variable lookups, with type checks that
            produce clear messages.
          </li>
          <li>
            <span className="text-fg">Functional error handling:</span>{" "}
            <Code>Either[Error, Value]</Code> throughout, composed with
            for-comprehensions — no exceptions for control flow.
          </li>
          <li>
            <span className="text-fg">Generic abstractions:</span> a single{" "}
            <Code>evalBinaryOp[T, R]</Code> handles arithmetic, comparison, and
            logical operators, and a single <Code>parseBinaryOp</Code> handles
            every precedence level.
          </li>
          <li>
            <span className="text-fg">Immutable environment:</span> a map from
            names to values where every operation returns a new environment,
            which makes shadowing fall out naturally.
          </li>
          <li>
            <span className="text-fg">Tested with ScalaTest:</span> a
            comprehensive suite across the evaluator, parser, environment, REPL,
            and integration behavior.
          </li>
        </ul>
        <p>
          The generic <Code>parseBinaryOp</Code> is a good example of how the
          precedence chain stays DRY — each level is the same function pointed at
          a different operator set and the next-tighter level:
        </p>
        <CodeBlock label="Scala">{parseBinaryOpSig}</CodeBlock>
      </DetailSection>

      <DetailSection id="learned" title="What I learned" eyebrow="Reflection">
        <p>
          This project helped connect formal language concepts to working
          software. Implementing the parser by hand made grammar structure,
          operator precedence, evaluation order, and error handling much more
          concrete than using a parser generator or library.
        </p>
        <p>
          Modeling the language as algebraic data types and threading results
          through <Code>Either</Code> also changed how I think about
          correctness: invalid states become hard to represent, and errors
          become impossible to silently ignore.
        </p>
      </DetailSection>

      <ProjectLinksSection project={project} />
    </ProjectDetailLayout>
  );
}
