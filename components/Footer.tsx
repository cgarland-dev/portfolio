import { site, mailto, isPlaceholder } from "@/data/site";

const year = new Date().getFullYear();

export default function Footer() {
  const links = [
    { label: "GitHub", href: site.github, external: true },
    { label: "LinkedIn", href: site.linkedin, external: true },
    { label: "Email", href: mailto, external: false },
  ];

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div className="text-sm text-muted">
          <p>
            © {year} {site.name}
          </p>
          <p className="mt-1">
            {site.role} | {site.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex items-center gap-5 text-sm">
            {links.map((link) =>
              isPlaceholder(link.href) ? (
                <li key={link.label}>
                  <span
                    aria-disabled="true"
                    title="Link coming soon"
                    className="cursor-not-allowed text-muted/50"
                  >
                    {link.label}
                  </span>
                </li>
              ) : (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted transition-colors hover:text-accent"
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
