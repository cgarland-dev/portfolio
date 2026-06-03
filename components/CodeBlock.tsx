import CopyButton from "@/components/CopyButton";

type CodeBlockProps = {
  children: React.ReactNode;
  /** Optional label shown in the title bar of the block. */
  label?: string;
  /** When provided, shows a Copy button that copies this text. */
  copyText?: string;
};

export default function CodeBlock({ children, label, copyText }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#04070e]">
      {(label || copyText) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted">{label}</span>
          {copyText && <CopyButton text={copyText} />}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}
