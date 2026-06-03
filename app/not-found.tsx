import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          Back home
        </ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          View projects
        </ButtonLink>
      </div>
    </div>
  );
}
