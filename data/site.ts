/**
 * Central place for site-wide identity and external links.
 *
 * Links marked PLACEHOLDER below are intentionally non-functional until
 * real URLs are provided. Components render placeholder links in a clearly
 * "coming soon" state instead of pointing at a guessed/invented URL.
 */

/** Sentinel for links that don't have a real URL yet. */
export const PLACEHOLDER = "#" as const;

export function isPlaceholder(href: string): boolean {
  return href === PLACEHOLDER;
}

export const site = {
  name: "Christopher Garland",
  role: "Software Developer",
  tagline: "Software Developer | Technical Systems & Tooling",
  location: "Chicago-area, IL",

  // Real, owned profile (org that hosts the Satisfactory Tools repo).
  github: "https://github.com/cgarland-dev",

  // Personal contact email.
  email: "cgarland101@gmail.com",

  // PLACEHOLDER — replace with the real LinkedIn profile URL.
  linkedin: PLACEHOLDER,

  // Resume lives in /public. Replace the placeholder PDF with the real one.
  resumePdf: "/resume.pdf",
} as const;

export const mailto = `mailto:${site.email}`;
