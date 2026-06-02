type SectionHeadingProps = {
  children: React.ReactNode;
  /** Small uppercase label shown above the heading. */
  eyebrow?: string;
  /** Heading level for correct document outline. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

const sizes = {
  h1: "text-3xl sm:text-4xl",
  h2: "text-2xl sm:text-3xl",
  h3: "text-xl sm:text-2xl",
} as const;

export default function SectionHeading({
  children,
  eyebrow,
  as: Tag = "h2",
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={`${sizes[Tag]} font-bold tracking-tight text-fg`}
      >
        {children}
      </Tag>
    </div>
  );
}
