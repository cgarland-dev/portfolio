# Christopher Garland Portfolio

Personal developer portfolio built with Next.js, TypeScript, and Tailwind CSS.

A clean, fast, static portfolio presenting projects, resume, and contact
information for Christopher Garland — Software Developer (Chicago-area, IL).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS v4
- Static content (no database, no auth, no CMS)
- Deployable to [Vercel](https://vercel.com/)

## Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Project structure

```text
app/
  layout.tsx                         # Root layout: header, footer, metadata
  page.tsx                           # Homepage (hero, about, featured, resume CTA)
  projects/page.tsx                  # Projects listing
  projects/satisfactory-tools/       # Project detail page
  projects/recursive-descent-parser/ # Project detail page
  resume/page.tsx                    # Resume page (+ PDF download)
  contact/page.tsx                   # Contact page
components/                          # Header, Footer, ProjectCard, etc.
data/
  projects.ts                        # Single source of truth for projects
  site.ts                            # Name, links, email, resume path
public/
  resume.pdf                         # Resume download (placeholder)
```

Project content is defined once in `data/projects.ts` and reused by the
homepage, the projects listing, and the detail pages.

## Replace before going live

A few values are placeholders until you provide the real ones — all are
centralized for easy editing:

- **LinkedIn URL** — set `linkedin` in `data/site.ts` (currently a placeholder;
  it renders as "coming soon" until set).
- **Resume PDF** — replace `public/resume.pdf` with the real file.
- **Recursive Descent Parser repo URL** — set `repoUrl` for that project in
  `data/projects.ts` (currently a placeholder).
- **Education details** — add institution and graduation year in
  `app/resume/page.tsx`.
- **Project screenshots** — drop images into the screenshot placeholders on the
  Satisfactory Tools detail page.

Optionally set `NEXT_PUBLIC_SITE_URL` to your production URL so metadata
resolves absolute URLs correctly.

## Deployment

Designed for deployment on Vercel. Push to your Git provider and import the
repository in Vercel — no extra configuration is required for a static
Next.js app.
