/**
 * MiniCalc — public API for the in-browser REPL.
 *
 * A faithful TypeScript port of the Scala MiniCalc interpreter's pure
 * expression language. `run` evaluates one line in a fresh scope; `evalLine`
 * evaluates against a persistent session environment and also supports a
 * REPL-only convenience binding (`name = expr`) so values can carry across
 * lines — mirroring the Scala REPL's `:env` / `:clear` behavior.
 */

import { formatError, showValue, type Value } from "@/lib/minicalc/ast";
import { parse } from "@/lib/minicalc/parser";
import { evaluate } from "@/lib/minicalc/evaluator";

export type { Value } from "@/lib/minicalc/ast";

export type RunResult =
  | { kind: "value"; text: string }
  | { kind: "error"; text: string };

export type LineResult =
  | { kind: "value"; text: string }
  | { kind: "binding"; text: string }
  | { kind: "error"; text: string };

/** Names that cannot be used as REPL binding targets. */
const RESERVED = new Set([
  "true",
  "false",
  "let",
  "in",
  "if",
  "then",
  "else",
  "define",
  "execute",
  "sequence",
  "parallel",
  "schedule",
  "workflow",
]);

// `name = expr` (a single `=`, not `==`) used for persistent REPL bindings.
const BINDING_RE = /^\s*([A-Za-z][A-Za-z0-9_]*)\s*=(?!=)\s*(.+)$/;

/** Evaluate one line in a fresh, empty environment. */
export function run(source: string): RunResult {
  const parsed = parse(source);
  if (!parsed.ok) return { kind: "error", text: formatError(parsed.error, source) };
  const result = evaluate(parsed.expr, new Map());
  if (!result.ok) return { kind: "error", text: formatError(result.error, source) };
  return { kind: "value", text: showValue(result.value) };
}

/**
 * Evaluate one REPL line against a mutable session environment. A line of the
 * form `name = expr` binds `name` for subsequent lines; anything else is a
 * normal expression evaluated with the current bindings in scope.
 */
export function evalLine(source: string, env: Map<string, Value>): LineResult {
  const match = source.match(BINDING_RE);
  if (match && !RESERVED.has(match[1])) {
    const [, name, rhs] = match;
    const parsed = parse(rhs);
    if (!parsed.ok) return { kind: "error", text: formatError(parsed.error, rhs) };
    const result = evaluate(parsed.expr, env);
    if (!result.ok) return { kind: "error", text: formatError(result.error, rhs) };
    env.set(name, result.value);
    return { kind: "binding", text: `${name} = ${showValue(result.value)}` };
  }

  const parsed = parse(source);
  if (!parsed.ok) return { kind: "error", text: formatError(parsed.error, source) };
  const result = evaluate(parsed.expr, env);
  if (!result.ok) return { kind: "error", text: formatError(result.error, source) };
  return { kind: "value", text: showValue(result.value) };
}

/** Render the current session bindings for the `:env` command. */
export function showEnv(env: Map<string, Value>): string {
  if (env.size === 0) return "(no bindings)";
  return Array.from(env.entries())
    .map(([name, value]) => `  ${name} = ${showValue(value)}`)
    .join("\n");
}

export const WELCOME: string[] = [
  "MiniCalc — browser REPL (a TypeScript port of the Scala interpreter).",
  "Type an expression and press Enter. Type :help for help.",
];

export const HELP: string[] = [
  "MiniCalc expression language:",
  "  numbers      42, 3.14",
  "  booleans     true, false",
  "  arithmetic   + - * /",
  "  comparison   < > <= >= == !=",
  "  logic        && ||",
  "  conditional  if x > 5 then 100 else 200",
  "  scoped let   let x = 10 in x * 2",
  "  binding      price = 42        (persists across lines, then use `price`)",
  "",
  "Precedence (low to high): ||  &&  comparisons  + -  * /  ( )",
  "Commands: :help, :env, :clear",
  "Note: task/workflow features live in the full Scala project on GitHub.",
];

export const EXAMPLES: string[] = [
  "5 + 3 * 2",
  "(5 + 3) * 2 > 10 && true",
  "let x = 10 in x + 5",
  "if 10 > 5 then 100 else 200",
  "price = 42",
  "10 / 0",
];
