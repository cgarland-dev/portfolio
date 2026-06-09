import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailLayout, {
  DetailSection,
  ProjectLinksSection,
} from "@/components/ProjectDetailLayout";
import CodeBlock from "@/components/CodeBlock";
import MiniCalcRepl from "@/components/MiniCalcRepl";
import { getProject } from "@/data/projects";

const project = getProject("recursive-descent-parser");

export const metadata: Metadata = {
  title: "MiniCalc — Interpreter & Task-Orchestration Runtime",
  description:
    "A Scala 3 expression interpreter that grew into a Cats Effect task-orchestration runtime: a hand-written recursive descent parser and pure evaluator, plus typed tasks with priorities, dependencies, timeouts, and retries, a topological scheduler with cycle detection, and concurrent fiber-based execution — with an interactive REPL.",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-2">
      {children}
    </code>
  );
}

const listClass = "list-disc space-y-2 pl-5 marker:text-accent";

const taskSig = `// A task is a Cats Effect IO action plus its
// scheduling and execution configuration.
case class Task[A](
  id: TaskId,
  name: String,
  priority: Priority,              // High | Normal | Low
  dependencies: Set[TaskId],
  action: IO[A],                   // the work to run
  timeout: Option[FiniteDuration],
  retryPolicy: RetryPolicy,        // NoRetry | LinearRetry | ExponentialRetry
  metadata: Map[String, String]
)`;

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
          MiniCalc is a Scala 3 project in two layers. It started as a purely
          functional interpreter for a small expression language — source text
          is tokenized, parsed into an abstract syntax tree by a hand-written
          recursive descent parser, and evaluated by a pure, type-checked
          function that threads an immutable environment.
        </p>
        <p>
          It then grew into a <span className="text-fg">task-orchestration
          runtime</span>: you can define tasks with priorities, dependencies,
          timeouts, and retries, compose them into workflows, and run them
          concurrently on <Code>Cats Effect</Code> fibers — with a
          dependency-aware scheduler, cycle detection, and execution statistics,
          all driven from an interactive REPL.
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
        <p className="font-medium text-fg">Expression language</p>
        <ul className={listClass}>
          <li>
            Numbers, booleans, and variables with arithmetic, comparison, and
            logical operators at the correct precedence.
          </li>
          <li>
            <Code>let</Code> bindings and <Code>if/then/else</Code> conditionals,
            with lexical scope and variable shadowing.
          </li>
          <li>
            Type-checked evaluation with clear, position-aware errors — undefined
            variables, divide-by-zero, type mismatches, and parse errors with a
            caret.
          </li>
        </ul>

        <p className="font-medium text-fg">Task orchestration &amp; concurrency</p>
        <ul className={listClass}>
          <li>
            Define tasks with optional <span className="text-fg">priority</span>{" "}
            (High/Normal/Low), <span className="text-fg">dependencies</span>,{" "}
            <span className="text-fg">timeouts</span>, and{" "}
            <span className="text-fg">retry policies</span> (linear or
            exponential backoff).
          </li>
          <li>
            Compose tasks with <Code>sequence</Code> / <Code>parallel</Code>,
            schedule them <Code>with FIFO</Code> or <Code>PRIORITY</Code>, and
            name compositions as <span className="text-fg">workflows</span>.
          </li>
          <li>
            Dependency-aware <span className="text-fg">topological scheduling</span>{" "}
            with circular-dependency detection, then concurrent execution on Cats
            Effect fibers with a configurable maximum concurrency.
          </li>
          <li>
            <span className="text-fg">Execution statistics</span> — started /
            completed / failed counts, durations, and currently-running tasks.
          </li>
        </ul>
      </DetailSection>

      <DetailSection id="try" title="Try it in your browser" eyebrow="Live">
        <p>
          The console below is a faithful TypeScript port of MiniCalc&apos;s{" "}
          <span className="text-fg">expression layer</span> — the same two-phase
          tokenizer, recursive descent parser, evaluator, precedence rules, and
          error messages, running entirely in your browser. Type an expression
          and press Enter; <Code>:help</Code> shows the original command
          reference.
        </p>

        <MiniCalcRepl />

        <p className="text-sm">Quick reference:</p>
        <ul className={listClass}>
          <li>
            <span className="text-fg">Numbers &amp; booleans:</span>{" "}
            <Code>42</Code>, <Code>3.14</Code>, <Code>true</Code>,{" "}
            <Code>false</Code>
          </li>
          <li>
            <span className="text-fg">Arithmetic · comparison · logic:</span>{" "}
            <Code>+ - * /</Code>, <Code>{"< > <= >= == !="}</Code>,{" "}
            <Code>&amp;&amp; ||</Code>
          </li>
          <li>
            <span className="text-fg">Variables:</span>{" "}
            <Code>let x = 10 in x * 2</Code>
          </li>
          <li>
            <span className="text-fg">Conditionals:</span>{" "}
            <Code>if x &gt; 5 then 100 else 200</Code>
          </li>
        </ul>
        <p className="text-sm">
          The task, scheduling, and workflow features run on Cats Effect in the
          full Scala app, so they aren&apos;t part of this static browser demo —
          they need a real runtime.
        </p>
      </DetailSection>

      <DetailSection
        id="implementation"
        title="Technical implementation"
        eyebrow="Engineering"
      >
        <p>
          Both layers share one pipeline. Source is tokenized (<Code>String</Code>{" "}
          → <Code>List[Token]</Code>) and parsed by recursive descent into a
          sealed <Code>Expr</Code> AST. A pure <Code>eval</Code> handles
          expressions; an effectful <Code>evalIO</Code> (Cats Effect{" "}
          <Code>IO</Code>) handles task and workflow expressions, threading an
          immutable <Code>Environment</Code> of bindings, tasks, and workflows.
        </p>
        <ul className={listClass}>
          <li>
            <span className="text-fg">Parser &amp; evaluator:</span> a single
            generic <Code>parseBinaryOp</Code> per precedence level and a single{" "}
            <Code>evalBinaryOp[T, R]</Code> for all operators; errors are values
            (<Code>Either</Code>), never thrown for control flow.
          </li>
          <li>
            <span className="text-fg">Tasks:</span> a <Code>Task[A]</Code> wraps
            an <Code>IO</Code> action plus priority, dependencies, timeout, and
            retry policy, assembled with a fluent <Code>TaskBuilder</Code>.
          </li>
          <li>
            <span className="text-fg">Scheduler:</span> a{" "}
            <Code>TopologicalScheduler</Code> orders tasks with Kahn&apos;s
            algorithm and detects cycles via three-color DFS; FIFO and Priority
            strategies decide ties.
          </li>
          <li>
            <span className="text-fg">Execution:</span> a{" "}
            <Code>FiberExecutionEngine</Code> runs the plan with{" "}
            <Code>parTraverseN</Code>, applying per-task timeouts and retries and
            returning an <Code>ExecutionReport</Code>.
          </li>
          <li>
            <span className="text-fg">Tested with ScalaTest:</span> 13 spec
            suites — including property-based parser tests — across the parser,
            evaluator, environment, tasks, scheduler, execution engine, monitor,
            and REPL.
          </li>
        </ul>
        <p>
          The code is split into focused packages: <Code>ast</Code>,{" "}
          <Code>parser</Code>, <Code>eval</Code>, <Code>task</Code>,{" "}
          <Code>scheduler</Code>, <Code>execution</Code>, <Code>monitoring</Code>,
          and <Code>repl</Code>. A task is just an <Code>IO</Code> action plus its
          configuration:
        </p>
        <CodeBlock label="Scala" copyText={taskSig}>
          {taskSig}
        </CodeBlock>
        <p>
          …and the precedence chain stays DRY — each level is the same generic
          combinator pointed at a different operator set and the next-tighter
          level:
        </p>
        <CodeBlock label="Scala" copyText={parseBinaryOpSig}>
          {parseBinaryOpSig}
        </CodeBlock>
      </DetailSection>

      <DetailSection id="learned" title="What I learned" eyebrow="Reflection">
        <p>
          Building the parser and evaluator by hand made grammar structure,
          operator precedence, evaluation order, and error handling concrete —
          and modeling the language as algebraic data types threaded through{" "}
          <Code>Either</Code> made invalid states hard to represent and errors
          impossible to silently ignore.
        </p>
        <p>
          Extending it into a task runtime was a different lesson: expressing
          work as Cats Effect <Code>IO</Code>, keeping effects at the edges while
          the evaluation core stays pure, and getting concurrency right —
          topological scheduling, cycle detection, and fiber-based parallelism
          with timeouts and retries — without leaking mutability back into the
          interpreter.
        </p>
      </DetailSection>

      <ProjectLinksSection project={project} />
    </ProjectDetailLayout>
  );
}
