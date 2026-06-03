"use client";

import { useEffect, useRef, useState } from "react";
import { run, WELCOME, HELP, EXAMPLES } from "@/lib/minicalc";

type LineKind = "welcome" | "input" | "value" | "error" | "info";
type Line = { id: number; kind: LineKind; text: string };

const kindClass: Record<LineKind, string> = {
  welcome: "text-muted",
  info: "text-muted",
  input: "text-fg",
  value: "text-[#7ee787]",
  error: "text-[#ff7b72]",
};

let lineId = 0;
const nextLineId = () => (lineId += 1);

function welcomeLines(): Line[] {
  return WELCOME.map((text) => ({ id: nextLineId(), kind: "welcome", text }));
}

export default function MiniCalcRepl() {
  const [lines, setLines] = useState<Line[]>(() => welcomeLines());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(0);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the latest output in view.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const append = (entries: Omit<Line, "id">[]) =>
    setLines((prev) => [
      ...prev,
      ...entries.map((e) => ({ ...e, id: nextLineId() })),
    ]);

  const evaluateLine = (source: string) => {
    const trimmed = source.trim();
    if (trimmed.length === 0) return;

    if (trimmed === ":clear") {
      setLines(welcomeLines());
      return;
    }

    append([{ kind: "input", text: source }]);

    if (trimmed === ":help") {
      append(HELP.map((text) => ({ kind: "info" as const, text })));
      return;
    }
    if (trimmed.startsWith(":")) {
      append([
        { kind: "error", text: `Unknown command: ${trimmed}. Try :help.` },
      ]);
      return;
    }

    const result = run(source);
    append([{ kind: result.kind === "value" ? "value" : "error", text: result.text }]);
  };

  const submit = (source: string) => {
    evaluateLine(source);
    if (source.trim().length > 0) {
      setHistory((prev) => {
        const next = [...prev, source];
        setHistIdx(next.length);
        return next;
      });
    }
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const ni = Math.max(0, histIdx - 1);
      setHistIdx(ni);
      setInput(history[ni] ?? "");
    } else if (e.key === "ArrowDown") {
      if (history.length === 0) return;
      e.preventDefault();
      const ni = Math.min(history.length, histIdx + 1);
      setHistIdx(ni);
      setInput(ni === history.length ? "" : (history[ni] ?? ""));
    }
  };

  const runExample = (ex: string) => {
    evaluateLine(ex);
    setHistory((prev) => {
      const next = [...prev, ex];
      setHistIdx(next.length);
      return next;
    });
    inputRef.current?.focus();
  };

  return (
    <div className="not-prose">
      <div className="overflow-hidden rounded-lg border border-border bg-[#04070e]">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </span>
            <span className="font-mono text-xs text-muted">MiniCalc REPL</span>
          </div>
          <button
            type="button"
            onClick={() => setLines(welcomeLines())}
            className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-fg"
          >
            Clear
          </button>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-label="MiniCalc REPL output"
          onClick={() => inputRef.current?.focus()}
          className="h-72 cursor-text overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap break-words ${kindClass[line.kind]}`}
            >
              {line.kind === "input" ? (
                <>
                  <span className="text-accent">{"> "}</span>
                  {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}

          {/* Prompt */}
          <form onSubmit={onSubmit} className="mt-1 flex items-center">
            <label htmlFor="minicalc-input" className="sr-only">
              MiniCalc expression input
            </label>
            <span aria-hidden="true" className="text-accent">
              {"> "}
            </span>
            <input
              id="minicalc-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              className="ml-1 flex-1 border-none bg-transparent text-fg caret-accent outline-none"
            />
          </form>
        </div>
      </div>

      {/* Helper row */}
      <p className="mt-3 text-xs text-muted">
        Press <kbd className="font-mono text-fg">Enter</kbd> to run ·{" "}
        <kbd className="font-mono text-fg">↑</kbd>/
        <kbd className="font-mono text-fg">↓</kbd> for history · try{" "}
        <code className="font-mono text-accent-2">:help</code>
      </p>

      {/* Example chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => runExample(ex)}
            className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
