"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site, isPlaceholder } from "@/data/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

const externalLinks = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-fg transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-surface text-fg"
                    : "text-muted hover:bg-surface/60 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <span aria-hidden="true" className="mx-2 h-5 w-px bg-border" />

          {externalLinks.map((link) =>
            isPlaceholder(link.href) ? (
              <span
                key={link.label}
                aria-disabled="true"
                title="Link coming soon"
                className="cursor-not-allowed rounded-md px-3 py-2 text-sm text-muted/50"
              >
                {link.label}
              </span>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-accent"
              >
                {link.label}
                <span aria-hidden="true" className="ml-1 text-xs">
                  ↗
                </span>
              </a>
            ),
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-fg hover:bg-surface md:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-border bg-bg md:hidden"
        >
          <ul className="mx-auto max-w-5xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-3 py-2.5 text-base transition-colors ${
                      active
                        ? "bg-surface text-fg"
                        : "text-muted hover:bg-surface/60 hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li aria-hidden="true" className="my-2 h-px bg-border" />

            {externalLinks.map((link) =>
              isPlaceholder(link.href) ? (
                <li key={link.label}>
                  <span
                    aria-disabled="true"
                    title="Link coming soon"
                    className="block cursor-not-allowed rounded-md px-3 py-2.5 text-base text-muted/50"
                  >
                    {link.label}
                  </span>
                </li>
              ) : (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md px-3 py-2.5 text-base text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                    <span aria-hidden="true" className="ml-1 text-xs">
                      ↗
                    </span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
