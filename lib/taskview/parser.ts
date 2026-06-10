/**
 * TaskView parser — a two-phase recursive descent parser, ported from the
 * Scala `minicalc.parser.Parser`.
 *
 *   String -> tokenize -> Token[] -> parse -> Expr
 *
 * Operator precedence (lowest to highest):
 *   ||  ->  &&  ->  comparison  ->  + -  ->  * /  ->  primary
 * All binary operators are left-associative.
 */

import { type Expr, type EvalError, STRING_TO_OP } from "@/lib/taskview/ast";

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

type Token =
  | { t: "Num"; value: number; pos: number }
  | { t: "Bool"; value: boolean; pos: number }
  | { t: "Var"; name: string; pos: number }
  | { t: "Op"; op: string; pos: number }
  | { t: "Kw"; kw: string; pos: number }
  | { t: "LParen"; pos: number }
  | { t: "RParen"; pos: number }
  | { t: "LBracket"; pos: number }
  | { t: "RBracket"; pos: number }
  | { t: "Comma"; pos: number }
  | { t: "Assign"; pos: number };

// Control-flow keywords from the expression subset.
const EXPR_KEYWORDS = new Set(["let", "in", "if", "then", "else"]);
// Task/workflow entry keywords — recognized so we can give a clear message
// that they require the full Scala app rather than a misleading parse error.
const FEATURE_KEYWORDS = new Set([
  "define",
  "execute",
  "sequence",
  "parallel",
  "schedule",
  "workflow",
]);

const isDigit = (c: string) => c >= "0" && c <= "9";
const isLetter = (c: string) =>
  (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
const isIdentChar = (c: string) => isLetter(c) || isDigit(c) || c === "_";

function parseError(reason: string, position: number | null): EvalError {
  return { tag: "ParseError", reason, position };
}

function positionOf(tokens: Token[]): number {
  return tokens.length > 0 ? tokens[0].pos : 0;
}

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

function keywordOrVar(word: string, pos: number): Token {
  if (word === "true") return { t: "Bool", value: true, pos };
  if (word === "false") return { t: "Bool", value: false, pos };
  if (EXPR_KEYWORDS.has(word) || FEATURE_KEYWORDS.has(word))
    return { t: "Kw", kw: word, pos };
  return { t: "Var", name: word, pos };
}

const TWO_CHAR_OPS = new Set(["<=", ">=", "!=", "==", "&&", "||"]);

function tokenize(
  input: string,
): { ok: true; tokens: Token[] } | { ok: false; error: EvalError } {
  const tokens: Token[] = [];
  const n = input.length;
  let i = 0;

  while (i < n) {
    const c = input[i];

    if (/\s/.test(c)) {
      i += 1;
      continue;
    }

    const pos = i;

    if (isDigit(c)) {
      let j = i;
      while (j < n && (isDigit(input[j]) || input[j] === ".")) j += 1;
      const numStr = input.slice(i, j);
      const num = Number(numStr);
      if (numStr.length === 0 || Number.isNaN(num)) {
        return { ok: false, error: parseError(`Invalid number: ${numStr}`, pos) };
      }
      tokens.push({ t: "Num", value: num, pos });
      i = j;
      continue;
    }

    if (isLetter(c)) {
      let j = i;
      while (j < n && isIdentChar(input[j])) j += 1;
      tokens.push(keywordOrVar(input.slice(i, j), pos));
      i = j;
      continue;
    }

    // Two-character operators take precedence over single-character ones.
    const two = input.slice(i, i + 2);
    if (two.length === 2 && TWO_CHAR_OPS.has(two)) {
      tokens.push({ t: "Op", op: two, pos });
      i += 2;
      continue;
    }

    switch (c) {
      case "(":
        tokens.push({ t: "LParen", pos });
        break;
      case ")":
        tokens.push({ t: "RParen", pos });
        break;
      case "[":
        tokens.push({ t: "LBracket", pos });
        break;
      case "]":
        tokens.push({ t: "RBracket", pos });
        break;
      case ",":
        tokens.push({ t: "Comma", pos });
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "<":
      case ">":
        tokens.push({ t: "Op", op: c, pos });
        break;
      case "=":
        tokens.push({ t: "Assign", pos });
        break;
      default:
        return {
          ok: false,
          error: parseError(`Unexpected character: '${c}'`, pos),
        };
    }
    i += 1;
  }

  return { ok: true, tokens };
}

// ---------------------------------------------------------------------------
// Recursive descent parser
// ---------------------------------------------------------------------------

type PResult =
  | { ok: true; expr: Expr; rest: Token[] }
  | { ok: false; error: EvalError };

function err(error: EvalError): PResult {
  return { ok: false, error };
}

type SubParser = (tokens: Token[]) => PResult;

/** Generic left-associative binary-operator parser. */
function parseBinaryOp(
  tokens: Token[],
  operators: Set<string>,
  nextParser: SubParser,
): PResult {
  const first = nextParser(tokens);
  if (!first.ok) return first;

  let left = first.expr;
  let rest = first.rest;

  while (rest.length > 0 && rest[0].t === "Op" && operators.has(rest[0].op)) {
    const opStr = rest[0].op;
    const right = nextParser(rest.slice(1));
    if (!right.ok) return right;
    left = { tag: "BinOp", op: STRING_TO_OP[opStr], left, right: right.expr };
    rest = right.rest;
  }

  return { ok: true, expr: left, rest };
}

function parseExpr(tokens: Token[]): PResult {
  return parseOr(tokens);
}
function parseOr(tokens: Token[]): PResult {
  return parseBinaryOp(tokens, new Set(["||"]), parseAnd);
}
function parseAnd(tokens: Token[]): PResult {
  return parseBinaryOp(tokens, new Set(["&&"]), parseComparison);
}
function parseComparison(tokens: Token[]): PResult {
  return parseBinaryOp(
    tokens,
    new Set(["<", ">", "<=", ">=", "==", "!="]),
    parseAddSub,
  );
}
function parseAddSub(tokens: Token[]): PResult {
  return parseBinaryOp(tokens, new Set(["+", "-"]), parseMulDiv);
}
function parseMulDiv(tokens: Token[]): PResult {
  return parseBinaryOp(tokens, new Set(["*", "/"]), parsePrimary);
}

function parseLet(tokens: Token[]): PResult {
  const nameTok = tokens[0];
  if (!nameTok || nameTok.t !== "Var") {
    return err(parseError("Expected variable name after 'let'", positionOf(tokens)));
  }
  const afterVar = tokens.slice(1);
  if (!afterVar[0] || afterVar[0].t !== "Assign") {
    return err(
      parseError(
        "Expected '=' after variable name in let binding",
        positionOf(afterVar),
      ),
    );
  }
  const valueR = parseExpr(afterVar.slice(1));
  if (!valueR.ok) return valueR;
  const afterValue = valueR.rest;
  if (!(afterValue[0] && afterValue[0].t === "Kw" && afterValue[0].kw === "in")) {
    return err(
      parseError(
        "Expected 'in' keyword after let binding value",
        positionOf(afterValue),
      ),
    );
  }
  const bodyR = parseExpr(afterValue.slice(1));
  if (!bodyR.ok) return bodyR;
  return {
    ok: true,
    expr: { tag: "Let", name: nameTok.name, value: valueR.expr, body: bodyR.expr },
    rest: bodyR.rest,
  };
}

function parseIf(tokens: Token[]): PResult {
  const condR = parseExpr(tokens);
  if (!condR.ok) return condR;
  const afterCond = condR.rest;
  if (!(afterCond[0] && afterCond[0].t === "Kw" && afterCond[0].kw === "then")) {
    return err(
      parseError("Expected 'then' keyword after condition", positionOf(afterCond)),
    );
  }
  const thenR = parseExpr(afterCond.slice(1));
  if (!thenR.ok) return thenR;
  const afterThen = thenR.rest;
  if (!(afterThen[0] && afterThen[0].t === "Kw" && afterThen[0].kw === "else")) {
    return err(
      parseError("Expected 'else' keyword in conditional", positionOf(afterThen)),
    );
  }
  const elseR = parseExpr(afterThen.slice(1));
  if (!elseR.ok) return elseR;
  return {
    ok: true,
    expr: { tag: "If", cond: condR.expr, thenE: thenR.expr, elseE: elseR.expr },
    rest: elseR.rest,
  };
}

function parsePrimary(tokens: Token[]): PResult {
  if (tokens.length === 0) {
    return err(parseError("Unexpected end of input", null));
  }
  const tk = tokens[0];
  const rest = tokens.slice(1);

  switch (tk.t) {
    case "Num":
      return { ok: true, expr: { tag: "NumLit", value: tk.value }, rest };
    case "Bool":
      return { ok: true, expr: { tag: "BoolLit", value: tk.value }, rest };
    case "Var":
      return { ok: true, expr: { tag: "Var", name: tk.name }, rest };
    case "LParen": {
      const inner = parseExpr(rest);
      if (!inner.ok) return inner;
      if (inner.rest[0] && inner.rest[0].t === "RParen") {
        return { ok: true, expr: inner.expr, rest: inner.rest.slice(1) };
      }
      return err(
        parseError("Expected ')' to close parenthesis", positionOf(inner.rest)),
      );
    }
    case "Kw": {
      if (tk.kw === "let") return parseLet(rest);
      if (tk.kw === "if") return parseIf(rest);
      if (FEATURE_KEYWORDS.has(tk.kw)) {
        return err({
          tag: "Unsupported",
          reason:
            `'${tk.kw}' and other task/workflow features run in the full Scala ` +
            `app, not in this browser demo. Try the expression language — e.g. ` +
            `let x = 10 in x * 2`,
        });
      }
      return err(parseError("Expected expression", positionOf(tokens)));
    }
    default:
      return err(parseError("Expected expression", positionOf(tokens)));
  }
}

function parseTokens(
  tokens: Token[],
): { ok: true; expr: Expr } | { ok: false; error: EvalError } {
  const r = parseExpr(tokens);
  if (!r.ok) return { ok: false, error: r.error };
  if (r.rest.length === 0) return { ok: true, expr: r.expr };
  return {
    ok: false,
    error: parseError("Unexpected tokens after expression", positionOf(r.rest)),
  };
}

/** Parse a TaskView expression: String -> tokenize -> parse -> Expr. */
export function parse(
  input: string,
): { ok: true; expr: Expr } | { ok: false; error: EvalError } {
  const t = tokenize(input);
  if (!t.ok) return { ok: false, error: t.error };
  return parseTokens(t.tokens);
}
