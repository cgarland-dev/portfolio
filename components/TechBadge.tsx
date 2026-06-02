type TechBadgeProps = {
  children: React.ReactNode;
};

/** A small "chip" used to display a technology in a project's stack. */
export default function TechBadge({ children }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-2">
      {children}
    </span>
  );
}
