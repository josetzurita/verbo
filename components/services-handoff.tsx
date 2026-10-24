"use client";

import type { Service } from "@/lib/services";

export const HANDOFF_VIEWPORTS = 4;

const serviceTitle = ["Our", "expertise"] as const;

const serviceBorders = [
  "var(--trail-blue)",
  "var(--trail-amber)",
  "var(--trail-yellow)",
  "var(--foreground)",
  "color-mix(in srgb, var(--trail-blue) 55%, var(--foreground))",
  "color-mix(in srgb, var(--trail-amber) 50%, var(--foreground))",
  "color-mix(in srgb, var(--trail-yellow) 55%, var(--foreground))",
] as const;

function ServiceCard({
  title,
  deliverables,
  description,
  borderColor,
}: Pick<Service, "title" | "deliverables" | "description"> & { borderColor: string }) {
  const [lead, muted] = title;

  return (
    <article className="services-card" style={{ borderColor }}>
      <div className="services-card-body">
        <h3 className="services-card-title">
          <span className="services-card-lead">{lead}</span>
          <span className="services-card-muted">{muted}</span>
        </h3>
        <div className="services-card-foot">
          <ul className="services-deliverables">
            {deliverables.map((item) => (
              <li key={item.slug}>{item.name}</li>
            ))}
          </ul>
          <p className="services-card-copy">{description}</p>
        </div>
      </div>
    </article>
  );
}

export function ServicesHandoff({
  services,
  variant,
}: {
  services: readonly Service[];
  variant: "stage" | "reading";
}) {
  if (variant === "stage") {
    return (
      <div className="services-handoff-stage" data-theme="dark" aria-hidden="true">
        <div className="services-veil" />
        <div className="services-title">
          <p className="services-title-row">
            {serviceTitle.map((word) => (
              <span key={word} className="services-title-clip">
                <span className="services-title-word">{word}</span>
              </span>
            ))}
          </p>
        </div>
        {services.map((service, index) => (
          <ServiceCard
            key={service.slug}
            title={service.title}
            deliverables={service.deliverables}
            description={service.description}
            borderColor={serviceBorders[index] ?? serviceBorders[0]}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="services-handoff-reading" data-theme="dark">
      <div className="mx-auto grid max-w-[84rem] gap-6 px-5 py-20 md:px-12">
        <h2 className="mb-6 text-[clamp(2.6rem,4vw,4.75rem)] font-light leading-[0.95] tracking-[-0.04em]">
          Our expertise
        </h2>
        {services.map((service, index) => (
          <ServiceCard
            key={service.slug}
            title={service.title}
            deliverables={service.deliverables}
            description={service.description}
            borderColor={serviceBorders[index] ?? serviceBorders[0]}
          />
        ))}
      </div>
    </div>
  );
}
