/**
 * TaskView — public API for the in-browser REPL.
 *
 * A faithful TypeScript port of the Scala TaskView interpreter's pure
 * expression language. `evalLine` evaluates against a persistent session
 * environment and threads bindings the same way the Scala REPL does: a
 * top-level `let x = … in …` keeps `x` in scope for later lines.
 */

import { formatError, showValue } from "@/lib/taskview/ast";
import { parse } from "@/lib/taskview/parser";
import { evalThreaded, type Environment } from "@/lib/taskview/evaluator";

export type { Value } from "@/lib/taskview/ast";
export type { Environment } from "@/lib/taskview/evaluator";
export {
  WELCOME,
  HELP,
  HELP_FULL,
  SCALA_ONLY_COMMANDS,
} from "@/lib/taskview/help";

export type LineResult =
  | { kind: "value"; text: string; env: Environment }
  | { kind: "error"; text: string; env: Environment };

/**
 * Evaluate one REPL line against a session environment, returning the result
 * text and the (possibly extended) environment to thread into the next line.
 */
export function evalLine(source: string, env: Environment): LineResult {
  const parsed = parse(source);
  if (!parsed.ok) {
    return { kind: "error", text: formatError(parsed.error, source), env };
  }
  const result = evalThreaded(parsed.expr, env);
  if (!result.ok) {
    return { kind: "error", text: formatError(result.error, source), env };
  }
  return { kind: "value", text: showValue(result.value), env: result.env };
}

/** Render the current bindings for `:env` (mirrors the Scala REPL exactly). */
export function showEnv(env: Environment): string {
  if (env.size === 0) return "Environment is empty";
  return Array.from(env.entries())
    .map(([name, value]) => `${name} = ${showValue(value)}`)
    .join("\n");
}

export const EXAMPLES: string[] = [
  "1 + 2 * 3",
  "let x = 5 in x * 2",
  "if 10 > 5 then true else false",
  "5 > 3 && 2 < 4",
  "(1 + 2) * 3",
  "10 / 0",
];
