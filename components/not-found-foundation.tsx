import Link from "next/link";
import type { ProjectConfig } from "../lib/project-config";

export function NotFoundFoundation({
  config,
}: {
  config: ProjectConfig;
}) {
  return (
    <div className="px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Not found
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">
        This page is not in {config.site.name}.
      </h1>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
        Check the address or return to the home page. Identity on this screen
        comes from project configuration.
      </p>
      <Link className="mt-6 inline-block text-sm underline" href="/">
        Home
      </Link>
    </div>
  );
}
