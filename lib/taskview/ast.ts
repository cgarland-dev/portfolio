/**
 * TaskView — abstract syntax, runtime values, and error types.
 *
 * This is a faithful browser port of the Scala TaskView interpreter
 * (github.com/cgarland-dev/TaskView). It implements the pure expression
 * language exactly as the Scala `Evaluator.eval` does: numbers, booleans,
 * variables, arithmetic, comparisons, logic, `let` bindings, and `if`.
 * Names, precedence, and error wording match the original source.
 */

// ---------------------------------------------------------------------------
// Operators (mirrors ast/Operators.scala)
// ---------------------------------------------------------------------------

export type BinaryOp =
  | "Add"
  | "Sub"
  | "Mul"
  | "Div"
  | "Lt"
  | "Gt"
  | "Lte"
  | "Gte"
  | "Eq"
  | "Neq"
  | "And"
  | "Or";

export const ARITHMETIC: ReadonlySet<BinaryOp> = new Set([
  "Add",
  "Sub",
  "Mul",
  "Div",
]);
export const COMPARISON: ReadonlySet<BinaryOp> = new Set([
  "Lt",
  "Gt",
  "Lte",
  "Gte",
  "Eq",
  "Neq",
]);
export const LOGICAL: ReadonlySet<BinaryOp> = new Set(["And", "Or"]);

/** Op.stringToOp — maps operator symbols to BinaryOp. */
export const STRING_TO_OP: Readonly<Record<string, BinaryOp>> = {
  "+": "Add",
  "-": "Sub",
  "/": "Div",
  "*": "Mul",
  "<": "Lt",
  ">": "Gt",
  "<=": "Lte",
  ">=": "Gte",
  "==": "Eq",
  "!=": "Neq",
  "&&": "And",
  "||": "Or",
};

// ---------------------------------------------------------------------------
// Expressions (mirrors ast/Expr.scala — the midterm/expression subset)
// ---------------------------------------------------------------------------

export type Expr =
  | { tag: "NumLit"; value: number }
  | { tag: "BoolLit"; value: boolean }
  | { tag: "Var"; name: string }
  | { tag: "BinOp"; op: BinaryOp; left: Expr; right: Expr }
  | { tag: "Let"; name: string; value: Expr; body: Expr }
  | { tag: "If"; cond: Expr; thenE: Expr; elseE: Expr };

// ---------------------------------------------------------------------------
// Values (mirrors ast/Value.scala)
// ---------------------------------------------------------------------------

export type Value =
  | { tag: "Num"; n: number }
  | { tag: "Bool"; b: boolean };

/** typeName used in TypeMismatch messages. */
export function typeName(v: Value): string {
  return v.tag === "Num" ? "Number" : "Boolean";
}

/**
 * Mirrors Scala's `s"$n"` for Double — integer-valued doubles render with a
 * trailing `.0` (e.g. 11 -> "11.0"), matching the Scala REPL output.
 */
export function showNum(n: number): string {
  if (Number.isNaN(n)) return "NaN";
  if (n === Infinity) return "Infinity";
  if (n === -Infinity) return "-Infinity";
  if (Number.isInteger(n)) return `${n}.0`;
  return `${n}`;
}

/** Value.show */
export function showValue(v: Value): string {
  return v.tag === "Num" ? showNum(v.n) : `${v.b}`;
}

// ---------------------------------------------------------------------------
// Errors (mirrors eval/EvalError.scala — pure-eval + parse subset)
// ---------------------------------------------------------------------------

export type EvalError =
  | { tag: "DivisionByZero"; expr: string }
  | { tag: "UndefinedVariable"; name: string }
  | { tag: "TypeMismatch"; expected: string; got: string; expr: string }
  | { tag: "ParseError"; reason: string; position: number | null }
  // Not in the original; a friendly stand-in for task/workflow syntax that
  // exists in the full Scala app but cannot run in this browser demo.
  | { tag: "Unsupported"; reason: string };

/** EvalError.message */
export function errorMessage(e: EvalError): string {
  switch (e.tag) {
    case "DivisionByZero":
      return `Cannot divide by zero: ${e.expr}`;
    case "UndefinedVariable":
      return `Undefined variable: '${e.name}'`;
    case "TypeMismatch":
      return `Type mismatch: expected ${e.expected}, got ${e.got} in '${e.expr}'`;
    case "ParseError":
      return e.position === null
        ? `Parse error: ${e.reason}`
        : `Parse error at position ${e.position}: ${e.reason}`;
    case "Unsupported":
      return e.reason;
  }
}

/**
 * Formats an error for display. Parse errors get ParseError.messageWithContext
 * (a caret pointing at the offending position); everything else is prefixed
 * with "Error: " like the REPL.
 */
export function formatError(e: EvalError, input: string): string {
  if (e.tag === "Unsupported") return e.reason;
  if (e.tag === "ParseError") {
    if (e.position === null) return `Parse error: ${e.reason}`;
    return parseErrorWithContext(e.reason, e.position, input);
  }
  return `Error: ${errorMessage(e)}`;
}

/** Mirrors ParseError.messageWithContext. */
function parseErrorWithContext(
  reason: string,
  position: number,
  input: string,
): string {
  const lines = input.split("\n");
  let currentPos = 0;
  let lineNum = 0;
  let columnNum = position;

  while (
    lineNum < lines.length &&
    currentPos + lines[lineNum].length < position
  ) {
    currentPos += lines[lineNum].length + 1;
    lineNum += 1;
  }
  if (lineNum < lines.length) {
    columnNum = position - currentPos;
  }

  const errorLine = lineNum < lines.length ? lines[lineNum] : input;
  const pointer = " ".repeat(Math.max(0, columnNum)) + "^";

  return (
    `Parse error at position ${position} ` +
    `(line ${lineNum + 1}, column ${columnNum + 1}): ${reason}\n` +
    `  ${errorLine}\n  ${pointer}`
  );
}
