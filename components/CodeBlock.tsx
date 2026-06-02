type CodeBlockProps = {
  children: React.ReactNode;
  /** Optional label shown in the title bar of the block. */
  label?: string;
};

export default function CodeBlock({ children, label }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#04070e]">
      {label && (
        <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}
