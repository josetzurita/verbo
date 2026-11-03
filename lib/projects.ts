import { caseStudies as placeholderStudies, type CaseImage, type CaseStudy } from "./case-study";
import { cases as placeholderCases, type WorkCase } from "./home-content";
import { localePath, type Locale } from "./i18n";
import { sanityClient } from "./sanity";

// Projects come from Sanity at build time. While the dataset has no published
// projects, the placeholders in lib/ keep the site whole.

type Projects = {
  cases: readonly WorkCase[];
  studies: readonly CaseStudy[];
};

type RawImage = (Partial<Omit<CaseImage, "focus">> & { hotspot?: { x?: number; y?: number } | null }) | null;

type RawStudy = {
  summary?: string;
  title?: string[];
  wordmark?: string;
  siteHref?: string;
  siteLabel?: string;
  practices?: string[];
  hero?: RawImage;
  statement?: string;
  impactTitle?: string;
  impact?: string[];
  essay?: string[];
  gallery?: { wide?: RawImage; trio?: RawImage[]; plate?: RawImage; plateNote?: string[] };
  layers?: {
    title?: string;
    body?: string[];
    image?: RawImage;
    cards?: { label?: string; title?: string; body?: string; image?: RawImage }[];
  };
  shift?: { title?: string; pairs?: { from?: string; to?: string }[] };
  pair?: RawImage[];
  quote?: { title?: string; body?: string };
  visible?: { items?: { caption?: string; image?: RawImage }[]; title?: string; body?: string[] };
  places?: { title?: string; image?: RawImage; items?: { name?: string; region?: string; image?: RawImage }[] };
};

type RawCategory = { slug?: string; name?: string; nameEs?: string } | string | null;

// Spanish text twin, stored under `es` in Sanity. Images are shared with the English record.
type RawEsStudy = {
  summary?: string;
  title?: string[];
  siteLabel?: string;
  practices?: string[];
  statement?: string;
  impactTitle?: string;
  impact?: string[];
  essay?: string[];
  plateNote?: string[];
  layers?: { title?: string; body?: string[]; cards?: { label?: string; title?: string; body?: string }[] };
  shift?: { title?: string; pairs?: { from?: string; to?: string }[] };
  quote?: { title?: string; body?: string };
  visible?: { captions?: string[]; title?: string; body?: string[] };
  places?: { title?: string; items?: { name?: string; region?: string }[] };
};

type RawEs = { tag?: string; description?: string; moreLine?: string; caseStudy?: RawEsStudy | null };

type RawProject = {
  _updatedAt?: string;
  name: string;
  slug: string;
  tag?: string;
  description?: string;
  services?: RawCategory[];
  deliverables?: RawCategory[];
  moreLine?: string;
  designers?: string[];
  strategists?: string[];
  es?: RawEs | null;
  image?: RawImage;
  hasCaseStudy?: boolean;
  caseStudy?: RawStudy | null;
};

// lqip is a tiny blurred copy of the image; case pages show it while the real one loads.
const IMAGE = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, alt, hotspot }`;

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(order asc) {
  _updatedAt,
  name,
  "slug": slug.current,
  tag,
  description,
  "services": services[]->{ "slug": slug.current, name, "nameEs": es.name },
  "deliverables": deliverables[]->{ "slug": slug.current, name, "nameEs": es.name },
  moreLine,
  designers,
  strategists,
  es,
  "image": image${IMAGE},
  hasCaseStudy,
  caseStudy{
    ...,
    "hero": hero${IMAGE},
    gallery{ ..., "wide": wide${IMAGE}, "trio": trio[]${IMAGE}, "plate": plate${IMAGE} },
    layers{ ..., "image": image${IMAGE}, "cards": cards[]{ ..., "image": image${IMAGE} } },
    "pair": pair[]${IMAGE},
    visible{ ..., "items": items[]{ ..., "image": image${IMAGE} } },
    places{ ..., "image": image${IMAGE}, "items": items[]{ ..., "image": image${IMAGE} } }
  }
}`;

class MissingField extends Error {}

function need<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined || value === "") {
    throw new MissingField(field);
  }
  return value;
}

// The Studio hotspot is a 0-1 point; object-position takes percentages.
function focusOf(hotspot: { x?: number; y?: number } | null | undefined): string | undefined {
  if (typeof hotspot?.x !== "number" || typeof hotspot.y !== "number") return undefined;
  return `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`;
}

// A Studio image without alt text still gets a description from its project, so no content image ships with alt="".
function toImage(raw: RawImage | undefined, field: string, fallbackAlt = ""): CaseImage {
  const alt = raw?.alt?.trim() || fallbackAlt;
  if (!alt && process.env.NODE_ENV !== "production") {
    console.warn(`[projects] ${field} has no alt text in Sanity.`);
  }
  return {
    src: need(raw?.src, `${field}.src`),
    alt,
    width: need(raw?.width, `${field}.width`),
    height: need(raw?.height, `${field}.height`),
    focus: focusOf(raw?.hotspot),
    lqip: raw?.lqip ?? undefined,
  };
}

function exactly<T>(items: readonly T[] | undefined, count: number, field: string): T[] {
  if (!items || items.length !== count) {
    throw new MissingField(`${field} (needs ${count})`);
  }
  return [...items];
}

function toStudy(project: RawProject, raw: RawStudy, locale: Locale): Omit<CaseStudy, "more"> {
  const img = (raw: RawImage | undefined, field: string) =>
    toImage(raw, field, `${project.name} - Verbo project image`);
  const [t1, t2] = exactly(raw.title, 2, "title");
  const [trio1, trio2, trio3] = exactly(raw.gallery?.trio, 3, "gallery.trio").map((image, i) =>
    img(image, `gallery.trio[${i}]`),
  );
  const [note1, note2] = exactly(raw.gallery?.plateNote, 2, "gallery.plateNote");
  const [card1, card2, card3] = exactly(raw.layers?.cards, 3, "layers.cards").map((card, i) => ({
    label: card.label ?? "",
    title: card.title ?? "",
    body: card.body ?? "",
    image: img(card.image, `layers.cards[${i}].image`),
  }));
  const [pair1, pair2] = exactly(raw.pair, 2, "pair").map((image, i) => img(image, `pair[${i}]`));
  const [v1, v2, v3, v4] = exactly(raw.visible?.items, 4, "visible.items").map((item, i) => ({
    caption: item.caption ?? "",
    image: img(item.image, `visible.items[${i}].image`),
  }));

  return {
    slug: project.slug,
    name: project.name,
    updatedAt: project._updatedAt,
    summary: need(raw.summary, "summary"),
    title: [need(t1, "title[0]"), need(t2, "title[1]")],
    wordmark: raw.wordmark || project.name,
    siteHref: raw.siteHref ?? "",
    siteLabel: raw.siteLabel || (locale === "es" ? "Visitar sitio" : "Visit site"),
    practices: raw.practices ?? [],
    designers: project.designers ?? [],
    strategists: project.strategists ?? [],
    hero: img(raw.hero, "hero"),
    statement: need(raw.statement, "statement"),
    impactTitle: raw.impactTitle || (locale === "es" ? "Lo que cambió" : "What changed"),
    impact: raw.impact ?? [],
    essay: raw.essay ?? [],
    gallery: {
      wide: img(raw.gallery?.wide, "gallery.wide"),
      trio: [need(trio1, "trio"), need(trio2, "trio"), need(trio3, "trio")],
      plate: img(raw.gallery?.plate, "gallery.plate"),
      plateNote: [need(note1, "plateNote"), need(note2, "plateNote")],
    },
    layers: {
      title: raw.layers?.title || (locale === "es" ? "Construido en capas" : "Built in layers"),
      body: exactly(raw.layers?.body, 3, "layers.body"),
      image: img(raw.layers?.image, "layers.image"),
      cards: [need(card1, "cards"), need(card2, "cards"), need(card3, "cards")],
    },
    shift: {
      title: raw.shift?.title ?? "",
      pairs: (raw.shift?.pairs ?? []).map((pair) => ({ from: pair.from ?? "", to: pair.to ?? "" })),
    },
    pair: [need(pair1, "pair"), need(pair2, "pair")],
    quote: { title: raw.quote?.title ?? "", body: raw.quote?.body ?? "" },
    visible: {
      items: [need(v1, "visible"), need(v2, "visible"), need(v3, "visible"), need(v4, "visible")],
      title: raw.visible?.title ?? "",
      body: raw.visible?.body ?? [],
    },
    places: {
      title: raw.places?.title ?? "",
      image: img(raw.places?.image, "places.image"),
      // A row without its own thumbnail reuses the places image.
      items: (raw.places?.items ?? []).map((item, i) => ({
        name: item.name ?? "",
        region: item.region ?? "",
        image: img(item.image?.src ? item.image : raw.places?.image, `places.items[${i}].image`),
      })),
    },
  };
}

const filled = (value: string | undefined | null) => (value?.trim() ? value : undefined);
const filledList = <T,>(value: readonly T[] | undefined | null) => (value && value.length > 0 ? value : undefined);

// Spanish fields replace the English ones when they have text. Anything left empty stays English,
// so a half-translated project still builds. Card, caption and place lists match by position.
function localize(project: RawProject, locale: Locale): RawProject {
  const es = project.es;
  if (locale === "en" || !es) return project;
  const study = project.caseStudy;
  const ees = es.caseStudy;
  const merged: RawProject = {
    ...project,
    tag: filled(es.tag) ?? project.tag,
    description: filled(es.description) ?? project.description,
    moreLine: filled(es.moreLine) ?? project.moreLine,
  };
  if (!study || !ees) return merged;

  const layers = study.layers;
  const visible = study.visible;
  const places = study.places;
  merged.caseStudy = {
    ...study,
    summary: filled(ees.summary) ?? study.summary,
    title: filledList(ees.title) ? [...(ees.title as string[])] : study.title,
    siteLabel: filled(ees.siteLabel) ?? study.siteLabel,
    practices: filledList(ees.practices) ? [...(ees.practices as string[])] : study.practices,
    statement: filled(ees.statement) ?? study.statement,
    impactTitle: filled(ees.impactTitle) ?? study.impactTitle,
    impact: filledList(ees.impact) ? [...(ees.impact as string[])] : study.impact,
    essay: filledList(ees.essay) ? [...(ees.essay as string[])] : study.essay,
    gallery: study.gallery
      ? {
          ...study.gallery,
          plateNote: filledList(ees.plateNote) ? [...(ees.plateNote as string[])] : study.gallery.plateNote,
        }
      : study.gallery,
    layers: layers
      ? {
          ...layers,
          title: filled(ees.layers?.title) ?? layers.title,
          body: filledList(ees.layers?.body) ? [...(ees.layers?.body as string[])] : layers.body,
          cards: layers.cards?.map((card, i) => {
            const translated = ees.layers?.cards?.[i];
            return {
              ...card,
              label: filled(translated?.label) ?? card.label,
              title: filled(translated?.title) ?? card.title,
              body: filled(translated?.body) ?? card.body,
            };
          }),
        }
      : layers,
    shift: study.shift
      ? {
          title: filled(ees.shift?.title) ?? study.shift.title,
          pairs: filledList(ees.shift?.pairs) ? [...(ees.shift?.pairs ?? [])] : study.shift.pairs,
        }
      : study.shift,
    quote: study.quote
      ? {
          title: filled(ees.quote?.title) ?? study.quote.title,
          // An empty Spanish quote keeps the English one's emptiness: the section hides when there is no body.
          body: filled(ees.quote?.body) ?? study.quote.body,
        }
      : study.quote,
    visible: visible
      ? {
          ...visible,
          title: filled(ees.visible?.title) ?? visible.title,
          body: filledList(ees.visible?.body) ? [...(ees.visible?.body as string[])] : visible.body,
          items: visible.items?.map((item, i) => ({ ...item, caption: filled(ees.visible?.captions?.[i]) ?? item.caption })),
        }
      : visible,
    places: places
      ? {
          ...places,
          title: filled(ees.places?.title) ?? places.title,
          items: places.items?.map((item, i) => {
            const translated = ees.places?.items?.[i];
            return { ...item, name: filled(translated?.name) ?? item.name, region: filled(translated?.region) ?? item.region };
          }),
        }
      : places,
  };
  return merged;
}

// Older documents stored services as plain strings; references resolve to { slug, name }.
function categories(raw: readonly RawCategory[] | undefined, locale: Locale) {
  return (raw ?? []).flatMap((item) => {
    if (typeof item === "string") return [{ slug: item, name: item }];
    const name = (locale === "es" ? filled(item?.nameEs) : undefined) ?? item?.name;
    return name ? [{ slug: item?.slug ?? item?.name ?? name, name }] : [];
  });
}

function fromSanity(rawProjects: readonly RawProject[], locale: Locale): Projects {
  const raw = rawProjects.map((project) => localize(project, locale));
  const studies = new Map<string, Omit<CaseStudy, "more">>();
  for (const project of raw) {
    if (!project.hasCaseStudy || !project.caseStudy) continue;
    try {
      studies.set(project.slug, toStudy(project, project.caseStudy, locale));
    } catch (error) {
      if (!(error instanceof MissingField)) throw error;
      // An incomplete case study builds as a card without a link, not a broken page.
      console.warn(`[sanity] Skipping the "${project.slug}" case study: missing ${error.message}.`);
    }
  }

  const withImages = raw.filter((project) => project.image?.src);
  const hrefFor = (slug: string) => (studies.has(slug) ? localePath(locale, `/work/${slug}`) : null);

  const cases: WorkCase[] = withImages.map((project, i) => {
    const image = toImage(project.image, "image", `${project.name} - Verbo project`);
    const services = categories(project.services, locale);
    return {
      index: String(i + 1).padStart(2, "0"),
      name: project.name,
      tag: project.tag ?? "",
      description: project.description ?? "",
      services: services.map((service) => service.name).join(" / "),
      serviceSlugs: services.map((service) => service.slug),
      deliverableSlugs: categories(project.deliverables, locale).map((deliverable) => deliverable.slug),
      image: image.src,
      width: image.width,
      height: image.height,
      alt: image.alt,
      focus: image.focus,
      href: hrefFor(project.slug),
    };
  });

  const caseStudies: CaseStudy[] = [...studies.values()].map((study) => ({
    ...study,
    more: withImages
      .filter((project) => project.slug !== study.slug)
      .map((project) => ({
        name: project.name,
        line: project.moreLine || project.tag || "",
        href: hrefFor(project.slug) ?? localePath(locale, "/#work"),
        image: toImage(project.image, "image", `${project.name} - Verbo project`),
      })),
  }));

  return { cases, studies: caseStudies };
}

let rawProjects: Promise<RawProject[]> | undefined;
const built = new Map<Locale, Promise<Projects>>();

// The placeholders only show while the dataset is empty. Their links follow the language too.
function placeholders(locale: Locale): Projects {
  if (locale === "en") return { cases: placeholderCases, studies: placeholderStudies };
  return {
    cases: placeholderCases.map((item) => ({ ...item, href: item.href ? localePath(locale, item.href) : null })),
    studies: placeholderStudies.map((study) => ({
      ...study,
      more: study.more.map((item) => ({ ...item, href: localePath(locale, item.href) })),
    })),
  };
}

function loadProjects(locale: Locale): Promise<Projects> {
  rawProjects ??= sanityClient.fetch<RawProject[]>(PROJECTS_QUERY);
  let result = built.get(locale);
  if (!result) {
    result = rawProjects.then((raw) => (raw.length > 0 ? fromSanity(raw, locale) : placeholders(locale)));
    built.set(locale, result);
  }
  return result;
}

export async function getWorkCases(locale: Locale = "en") {
  return (await loadProjects(locale)).cases;
}

export async function getCaseStudies(locale: Locale = "en") {
  return (await loadProjects(locale)).studies;
}

export async function getCaseStudy(slug: string, locale: Locale = "en") {
  return (await getCaseStudies(locale)).find((study) => study.slug === slug);
}
