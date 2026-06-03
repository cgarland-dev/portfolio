/**
 * MiniCalc evaluator — a pure, recursive, environment-threading evaluator
 * ported from Scala `minicalc.eval.Evaluator.eval`.
 *
 * Semantics preserved from the original:
 * - Both operands of a binary op are evaluated, then type-extracted (so a
 *   logical op like `&&` is NOT short-circuiting and requires both sides to
 *   be booleans).
 * - Division by zero yields `Cannot divide by zero: <l> / <r>`.
 * - Type errors yield `Type mismatch: expected X, got Y in '<value>'`.
 */

import {
  type Expr,
  type Value,
  type EvalError,
  type BinaryOp,
  ARITHMETIC,
  COMPARISON,
  showNum,
  showValue,
  typeName,
} from "@/lib/minicalc/ast";

export type Environment = ReadonlyMap<string, Value>;

export type EvalResult =
  | { ok: true; value: Value }
  | { ok: false; error: EvalError };

const num = (n: number): EvalResult => ({ ok: true, value: { tag: "Num", n } });
const bool = (b: boolean): EvalResult => ({
  ok: true,
  value: { tag: "Bool", b },
});

function extractNumber(
  v: Value,
): { ok: true; n: number } | { ok: false; error: EvalError } {
  if (v.tag === "Num") return { ok: true, n: v.n };
  return {
    ok: false,
    error: {
      tag: "TypeMismatch",
      expected: "Number",
      got: typeName(v),
      expr: showValue(v),
    },
  };
}

function extractBoolean(
  v: Value,
): { ok: true; b: boolean } | { ok: false; error: EvalError } {
  if (v.tag === "Bool") return { ok: true, b: v.b };
  return {
    ok: false,
    error: {
      tag: "TypeMismatch",
      expected: "Boolean",
      got: typeName(v),
      expr: showValue(v),
    },
  };
}

export function evaluate(expr: Expr, env: Environment): EvalResult {
  switch (expr.tag) {
    case "NumLit":
      return num(expr.value);

    case "BoolLit":
      return bool(expr.value);

    case "Var": {
      const v = env.get(expr.name);
      if (v === undefined) {
        return { ok: false, error: { tag: "UndefinedVariable", name: expr.name } };
      }
      return { ok: true, value: v };
    }

    case "Let": {
      const valueR = evaluate(expr.value, env);
      if (!valueR.ok) return valueR;
      const extended = new Map(env);
      extended.set(expr.name, valueR.value);
      return evaluate(expr.body, extended);
    }

    case "If": {
      const condR = evaluate(expr.cond, env);
      if (!condR.ok) return condR;
      const cond = extractBoolean(condR.value);
      if (!cond.ok) return { ok: false, error: cond.error };
      return evaluate(cond.b ? expr.thenE : expr.elseE, env);
    }

    case "BinOp":
      return evalBinOp(expr.op, expr.left, expr.right, env);
  }
}

function evalBinOp(
  op: BinaryOp,
  left: Expr,
  right: Expr,
  env: Environment,
): EvalResult {
  // Mirror evalBinaryOp: evaluate both operands first, then extract/apply.
  const l = evaluate(left, env);
  if (!l.ok) return l;
  const r = evaluate(right, env);
  if (!r.ok) return r;

  if (ARITHMETIC.has(op)) {
    const ln = extractNumber(l.value);
    if (!ln.ok) return { ok: false, error: ln.error };
    const rn = extractNumber(r.value);
    if (!rn.ok) return { ok: false, error: rn.error };
    switch (op) {
      case "Add":
        return num(ln.n + rn.n);
      case "Sub":
        return num(ln.n - rn.n);
      case "Mul":
        return num(ln.n * rn.n);
      case "Div":
        if (rn.n === 0) {
          return {
            ok: false,
            error: {
              tag: "DivisionByZero",
              expr: `${showNum(ln.n)} / ${showNum(rn.n)}`,
            },
          };
        }
        return num(ln.n / rn.n);
    }
  }

  if (COMPARISON.has(op)) {
    const ln = extractNumber(l.value);
    if (!ln.ok) return { ok: false, error: ln.error };
    const rn = extractNumber(r.value);
    if (!rn.ok) return { ok: false, error: rn.error };
    switch (op) {
      case "Lt":
        return bool(ln.n < rn.n);
      case "Gt":
        return bool(ln.n > rn.n);
      case "Lte":
        return bool(ln.n <= rn.n);
      case "Gte":
        return bool(ln.n >= rn.n);
      case "Eq":
        return bool(ln.n === rn.n);
      case "Neq":
        return bool(ln.n !== rn.n);
    }
  }

  // Logical (And / Or)
  const lb = extractBoolean(l.value);
  if (!lb.ok) return { ok: false, error: lb.error };
  const rb = extractBoolean(r.value);
  if (!rb.ok) return { ok: false, error: rb.error };
  return op === "And" ? bool(lb.b && rb.b) : bool(lb.b || rb.b);
}
