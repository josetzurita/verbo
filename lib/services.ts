import { services as placeholderServices } from "./home-content";
import spanishServices from "./es/services.json";
import type { Locale } from "./i18n";
import { sanityClient } from "./sanity";

// Services come from Sanity at build time and double as the work filter's
// categories. While the dataset has none, the lib/ list keeps the cards whole.
// Spanish text sits in an `es` object on each Sanity document and falls back to English when empty.

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
  es?: { name?: string; title?: string[]; description?: string } | null;
  deliverables?: ({ slug?: string; name?: string; nameEs?: string } | null)[];
};

const SERVICES_QUERY = `*[_type == "service" && defined(slug.current)] | order(order asc) {
  "slug": slug.current,
  name,
  title,
  description,
  es,
  "deliverables": deliverables[]->{ "slug": slug.current, name, "nameEs": es.name }
}`;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const filled = (value: string | undefined | null) => (value?.trim() ? value : undefined);

const englishFallback: readonly Service[] = placeholderServices.map((service) => ({
  slug: service.slug,
  name: service.name,
  title: service.title,
  description: service.description,
  deliverables: service.deliverables.map((name) => ({ slug: slugify(name), name })),
}));

type SpanishFallback = { slug: string; name: string; title: string[]; deliverables: string[]; description: string };

const spanishFallback: readonly Service[] = (spanishServices as SpanishFallback[]).map((service) => {
  const english = placeholderServices.find((item) => item.slug === service.slug);
  return {
    slug: service.slug,
    name: service.name,
    title: [service.title[0] ?? service.name, service.title[1] ?? ""] as const,
    description: service.description,
    // Slugs stay the English ones so filter links match across languages.
    deliverables: service.deliverables.map((name, i) => ({
      slug: slugify(english?.deliverables[i] ?? name),
      name,
    })),
  };
});

function fromSanity(raw: readonly RawService[], locale: Locale): Service[] {
  return raw.flatMap((service) => {
    if (!service.slug || !service.name) return [];
    const es = locale === "es" ? service.es : null;
    const title = es?.title && es.title.length === 2 && es.title.every(Boolean) ? es.title : service.title;
    const name = filled(es?.name) ?? service.name;
    const [lead = name, muted = ""] = title ?? [];
    return [
      {
        slug: service.slug,
        name,
        title: [lead, muted] as const,
        description: filled(es?.description) ?? service.description ?? "",
        deliverables: (service.deliverables ?? []).flatMap((item) => {
          const label = (locale === "es" ? filled(item?.nameEs) : undefined) ?? item?.name;
          return item?.slug && label ? [{ slug: item.slug, name: label }] : [];
        }),
      },
    ];
  });
}

let rawServices: Promise<RawService[]> | undefined;
const built = new Map<Locale, Promise<readonly Service[]>>();

export function getServices(locale: Locale = "en"): Promise<readonly Service[]> {
  rawServices ??= sanityClient.fetch<RawService[]>(SERVICES_QUERY);
  let result = built.get(locale);
  if (!result) {
    result = rawServices.then((raw) => {
      const mapped = fromSanity(raw, locale);
      if (mapped.length > 0) return mapped;
      return locale === "es" ? spanishFallback : englishFallback;
    });
    built.set(locale, result);
  }
  return result;
}
