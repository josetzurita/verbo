"use client";

import { useEffect, useMemo, useState } from "react";
import type { WorkCase } from "@/lib/home-content";
import type { Service } from "@/lib/services";
import { ResponsiveImage } from "./responsive-image";
import { TransitionLink } from "./transition-link";
import { ViewSquare } from "./view-square";

const imageBorders = [
  "var(--trail-blue)",
  "var(--trail-amber)",
  "var(--trail-yellow)",
  "var(--foreground)",
] as const;

type Filter = { service: string | null; deliverable: string | null };

// The filter lives in ?service=&deliverable= so a filtered view can be linked.
function readFilter(): Filter {
  const params = new URLSearchParams(window.location.search);
  return { service: params.get("service"), deliverable: params.get("deliverable") };
}

function writeFilter(filter: Filter) {
  const url = new URL(window.location.href);
  url.search = "";
  if (filter.service) url.searchParams.set("service", filter.service);
  if (filter.deliverable) url.searchParams.set("deliverable", filter.deliverable);
  window.history.replaceState(window.history.state, "", url);
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`work-filter-chip ${active ? "is-active" : ""}`}
    >
      {children}
      {count === undefined ? null : <span className="work-filter-count">{count}</span>}
    </button>
  );
}

export function WorkIndex({ cases, services }: { cases: readonly WorkCase[]; services: readonly Service[] }) {
  const [filter, setFilter] = useState<Filter>({ service: null, deliverable: null });

  useEffect(() => {
    setFilter(readFilter());
  }, []);

  const select = (next: Filter) => {
    setFilter(next);
    writeFilter(next);
  };

  // Only categories that at least one project carries become chips.
  const withProjects = useMemo(
    () =>
      services
        .map((service) => ({
          service,
          count: cases.filter((item) => item.serviceSlugs?.includes(service.slug)).length,
        }))
        .filter((entry) => entry.count > 0),
    [cases, services],
  );

  const activeService = services.find((service) => service.slug === filter.service);
  const deliverables = (activeService?.deliverables ?? [])
    .map((deliverable) => ({
      deliverable,
      count: cases.filter(
        (item) =>
          item.serviceSlugs?.includes(activeService?.slug ?? "") &&
          item.deliverableSlugs?.includes(deliverable.slug),
      ).length,
    }))
    .filter((entry) => entry.count > 0);

  const shown = cases.filter(
    (item) =>
      (!filter.service || item.serviceSlugs?.includes(filter.service)) &&
      (!filter.deliverable || item.deliverableSlugs?.includes(filter.deliverable)),
  );

  return (
    <div className="work-index px-5 pt-[10rem] pb-24 md:px-12">
      <h1 className="text-[clamp(2.75rem,6vw,6.5rem)] font-light leading-[0.95] tracking-[-0.04em]">
        Our selected
        <br />
        projects
      </h1>

      <div className="mt-12 grid gap-4" role="group" aria-label="Filter projects by service">
        <div className="work-filter-row">
          <Chip active={!filter.service} count={cases.length} onClick={() => select({ service: null, deliverable: null })}>
            All
          </Chip>
          {withProjects.map(({ service, count }) => (
            <Chip
              key={service.slug}
              active={filter.service === service.slug}
              count={count}
              onClick={() => select({ service: service.slug, deliverable: null })}
            >
              {service.name}
            </Chip>
          ))}
        </div>
        {deliverables.length > 1 ? (
          <div className="work-filter-row work-filter-row-sub" aria-label={`${activeService?.name} deliverables`}>
            {deliverables.map(({ deliverable, count }) => (
              <Chip
                key={deliverable.slug}
                active={filter.deliverable === deliverable.slug}
                count={count}
                onClick={() =>
                  select({
                    service: filter.service,
                    deliverable: filter.deliverable === deliverable.slug ? null : deliverable.slug,
                  })
                }
              >
                {deliverable.name}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-10 text-sm font-normal" aria-live="polite">
        {shown.length === 1 ? "1 project" : `${shown.length} projects`}
      </p>

      {shown.length === 0 ? (
        <p className="mt-6 max-w-[40ch] text-base leading-relaxed">
          No projects in this category yet.{" "}
          <button type="button" className="underline underline-offset-4" onClick={() => select({ service: null, deliverable: null })}>
            Show all projects
          </button>
        </p>
      ) : (
        <ol className="mt-6 grid gap-x-5 gap-y-16 md:grid-cols-2">
          {shown.map((item, index) => (
            <li key={item.name} data-coordinate-project="" className="relative grid content-start gap-4">
              <div className="relative border-2 bg-surface" style={{ borderColor: imageBorders[index % imageBorders.length] }}>
                <ResponsiveImage
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] h-auto w-full object-cover"
                  style={{ objectPosition: item.focus }}
                  fallback={<p className="px-4 py-16 text-sm">{item.name}</p>}
                />
                {item.href ? <ViewSquare /> : null}
              </div>
              <p className="text-sm font-normal leading-relaxed">{item.tag}</p>
              <h2 className="text-[clamp(2rem,3vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                {item.href ? (
                  <TransitionLink
                    href={item.href}
                    className="after:absolute after:inset-0 after:z-[2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                  >
                    {item.name}
                  </TransitionLink>
                ) : (
                  item.name
                )}
              </h2>
              <p className="max-w-[56ch] text-base font-normal leading-relaxed text-copy">{item.description}</p>
              <p className="text-sm font-normal leading-relaxed">{item.services}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
