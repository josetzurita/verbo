import { services as placeholderServices } from "./home-content";
import { sanityClient } from "./sanity";

// Services come from Sanity at build time and double as the work filter's
// categories. While the dataset has none, the lib/ list keeps the cards whole.

export type Deliverable = { slug: string; name: string };

export type Service = {
  slug: string;
  name: string;
  title: readonly [string, string];
  deliverables: readonly Deliverable[];
  description: string;
};

type RawService = {
  slug?: string;
  name?: string;
  title?: string[];
  description?: string;
  deliverables?: ({ slug?: string; name?: string } | null)[];
};

const SERVICES_QUERY = `*[_type == "service" && defined(slug.current)] | order(order asc) {
  "slug": slug.current,
  name,
  title,
  description,
  "deliverables": deliverables[]->{ "slug": slug.current, name }
}`;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const fallback: readonly Service[] = placeholderServices.map((service) => ({
  slug: service.slug,
  name: service.name,
  title: service.title,
  description: service.description,
  deliverables: service.deliverables.map((name) => ({ slug: slugify(name), name })),
}));

function fromSanity(raw: readonly RawService[]): Service[] {
  return raw.flatMap((service) => {
    if (!service.slug || !service.name) return [];
    const [lead = service.name, muted = ""] = service.title ?? [];
    return [
      {
        slug: service.slug,
        name: service.name,
        title: [lead, muted] as const,
        description: service.description ?? "",
        deliverables: (service.deliverables ?? []).flatMap((item) =>
          item?.slug && item.name ? [{ slug: item.slug, name: item.name }] : [],
        ),
      },
    ];
  });
}

let services: Promise<readonly Service[]> | undefined;

export function getServices(): Promise<readonly Service[]> {
  services ??= sanityClient
    .fetch<RawService[]>(SERVICES_QUERY)
    .then((raw) => {
      const mapped = fromSanity(raw);
      return mapped.length > 0 ? mapped : fallback;
    });
  return services;
}
