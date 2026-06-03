/**
 * Lightweight, non-failing tokenizer used only to syntax-highlight the REPL
 * input line. Unlike the real parser's tokenizer it never errors — it just
 * colors recognizable pieces and passes everything else through.
 */

const KEYWORDS = new Set(["let", "in", "if", "then", "else"]);
const BOOLEANS = new Set(["true", "false"]);
const FEATURE = new Set([
  "define",
  "execute",
  "sequence",
  "parallel",
  "schedule",
  "workflow",
]);

const COLOR = {
  number: "#79c0ff",
  keyword: "#ff7b72",
  boolean: "#d2a8ff",
  operator: "#ffa657",
  punct: "#8b98a9",
  ident: "inherit",
  space: "inherit",
} as const;

export type HighlightSpan = { text: string; color: string };

const isDigit = (c: string) => c >= "0" && c <= "9";
const isLetter = (c: string) => /[A-Za-z]/.test(c);
const isIdent = (c: string) => /[A-Za-z0-9_]/.test(c);
const TWO_CHAR = ["<=", ">=", "!=", "==", "&&", "||"];

export function highlight(src: string): HighlightSpan[] {
  const spans: HighlightSpan[] = [];
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];

    if (/\s/.test(c)) {
      let j = i;
      while (j < n && /\s/.test(src[j])) j += 1;
      spans.push({ text: src.slice(i, j), color: COLOR.space });
      i = j;
      continue;
    }

    if (isDigit(c)) {
      let j = i;
      while (j < n && (isDigit(src[j]) || src[j] === ".")) j += 1;
      spans.push({ text: src.slice(i, j), color: COLOR.number });
      i = j;
      continue;
    }

    if (isLetter(c)) {
      let j = i;
      while (j < n && isIdent(src[j])) j += 1;
      const word = src.slice(i, j);
      const color = BOOLEANS.has(word)
        ? COLOR.boolean
        : KEYWORDS.has(word) || FEATURE.has(word)
          ? COLOR.keyword
          : COLOR.ident;
      spans.push({ text: word, color });
      i = j;
      continue;
    }

    const two = src.slice(i, i + 2);
    if (two.length === 2 && TWO_CHAR.includes(two)) {
      spans.push({ text: two, color: COLOR.operator });
      i += 2;
      continue;
    }

    if ("+-*/<>=".includes(c)) {
      spans.push({ text: c, color: COLOR.operator });
      i += 1;
      continue;
    }

    spans.push({ text: c, color: COLOR.punct });
    i += 1;
  }

  return spans;
}
