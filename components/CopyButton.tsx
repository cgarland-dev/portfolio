"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  className?: string;
};

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore silently.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`rounded px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-fg ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
