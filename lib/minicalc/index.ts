/**
 * MiniCalc — public API for the in-browser REPL.
 *
 * A faithful TypeScript port of the Scala MiniCalc interpreter's pure
 * expression language. `run` takes one line of source and returns either the
 * formatted value or a formatted error, mirroring the Scala REPL's output.
 */

import { formatError, showValue } from "@/lib/minicalc/ast";
import { parse } from "@/lib/minicalc/parser";
import { evaluate, type Environment } from "@/lib/minicalc/evaluator";

export type RunResult =
  | { kind: "value"; text: string }
  | { kind: "error"; text: string };

const EMPTY_ENV: Environment = new Map();

export function run(source: string): RunResult {
  const parsed = parse(source);
  if (!parsed.ok) return { kind: "error", text: formatError(parsed.error, source) };

  const result = evaluate(parsed.expr, EMPTY_ENV);
  if (!result.ok) return { kind: "error", text: formatError(result.error, source) };

  return { kind: "value", text: showValue(result.value) };
}

export const WELCOME: string[] = [
  "MiniCalc — browser REPL (a TypeScript port of the Scala interpreter).",
  'Type an expression and press Enter. Type :help for help.',
];

export const HELP: string[] = [
  "MiniCalc expression language:",
  "  numbers      42, 3.14",
  "  booleans     true, false",
  "  arithmetic   + - * /",
  "  comparison   < > <= >= == !=",
  "  logic        && ||",
  "  variables    let x = 10 in x * 2",
  "  conditional  if x > 5 then 100 else 200",
  "",
  "Precedence (low to high): ||  &&  comparisons  + -  * /  ( )",
  "Commands: :help, :clear",
  "Note: task/workflow features live in the full Scala project on GitHub.",
];

export const EXAMPLES: string[] = [
  "5 + 3 * 2",
  "(5 + 3) * 2 > 10 && true",
  "let x = 10 in x + 5",
  "if 10 > 5 then 100 else 200",
  "let price = 42 in let qty = 3 in price * qty",
  "10 / 0",
];
