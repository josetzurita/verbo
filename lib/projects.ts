import { caseStudies as placeholderStudies, type CaseImage, type CaseStudy } from "./case-study";
import { cases as placeholderCases, type WorkCase } from "./home-content";
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

type RawCategory = { slug?: string; name?: string } | string | null;

type RawProject = {
  name: string;
  slug: string;
  tag?: string;
  description?: string;
  services?: RawCategory[];
  deliverables?: RawCategory[];
  moreLine?: string;
  image?: RawImage;
  hasCaseStudy?: boolean;
  caseStudy?: RawStudy | null;
};

// lqip is a tiny blurred copy of the image; case pages show it while the real one loads.
const IMAGE = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, alt, hotspot }`;

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(order asc) {
  name,
  "slug": slug.current,
  tag,
  description,
  "services": services[]->{ "slug": slug.current, name },
  "deliverables": deliverables[]->{ "slug": slug.current, name },
  moreLine,
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

function toImage(raw: RawImage | undefined, field: string): CaseImage {
  return {
    src: need(raw?.src, `${field}.src`),
    alt: raw?.alt ?? "",
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

function toStudy(project: RawProject, raw: RawStudy): Omit<CaseStudy, "more"> {
  const [t1, t2] = exactly(raw.title, 2, "title");
  const [trio1, trio2, trio3] = exactly(raw.gallery?.trio, 3, "gallery.trio").map((image, i) =>
    toImage(image, `gallery.trio[${i}]`),
  );
  const [note1, note2] = exactly(raw.gallery?.plateNote, 2, "gallery.plateNote");
  const [card1, card2, card3] = exactly(raw.layers?.cards, 3, "layers.cards").map((card, i) => ({
    label: card.label ?? "",
    title: card.title ?? "",
    body: card.body ?? "",
    image: toImage(card.image, `layers.cards[${i}].image`),
  }));
  const [pair1, pair2] = exactly(raw.pair, 2, "pair").map((image, i) => toImage(image, `pair[${i}]`));
  const [v1, v2, v3, v4] = exactly(raw.visible?.items, 4, "visible.items").map((item, i) => ({
    caption: item.caption ?? "",
    image: toImage(item.image, `visible.items[${i}].image`),
  }));

  return {
    slug: project.slug,
    name: project.name,
    summary: need(raw.summary, "summary"),
    title: [need(t1, "title[0]"), need(t2, "title[1]")],
    wordmark: raw.wordmark || project.name,
    siteHref: raw.siteHref ?? "",
    siteLabel: raw.siteLabel || "Visit site",
    practices: raw.practices ?? [],
    hero: toImage(raw.hero, "hero"),
    statement: need(raw.statement, "statement"),
    impactTitle: raw.impactTitle || "What changed",
    impact: raw.impact ?? [],
    essay: raw.essay ?? [],
    gallery: {
      wide: toImage(raw.gallery?.wide, "gallery.wide"),
      trio: [need(trio1, "trio"), need(trio2, "trio"), need(trio3, "trio")],
      plate: toImage(raw.gallery?.plate, "gallery.plate"),
      plateNote: [need(note1, "plateNote"), need(note2, "plateNote")],
    },
    layers: {
      title: raw.layers?.title || "Built in layers",
      body: exactly(raw.layers?.body, 3, "layers.body"),
      image: toImage(raw.layers?.image, "layers.image"),
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
      image: toImage(raw.places?.image, "places.image"),
      // A row without its own thumbnail reuses the places image.
      items: (raw.places?.items ?? []).map((item, i) => ({
        name: item.name ?? "",
        region: item.region ?? "",
        image: toImage(item.image?.src ? item.image : raw.places?.image, `places.items[${i}].image`),
      })),
    },
  };
}

// Older documents stored services as plain strings; references resolve to { slug, name }.
function categories(raw: readonly RawCategory[] | undefined) {
  return (raw ?? []).flatMap((item) => {
    if (typeof item === "string") return [{ slug: item, name: item }];
    return item?.name ? [{ slug: item.slug ?? item.name, name: item.name }] : [];
  });
}

function fromSanity(raw: readonly RawProject[]): Projects {
  const studies = new Map<string, Omit<CaseStudy, "more">>();
  for (const project of raw) {
    if (!project.hasCaseStudy || !project.caseStudy) continue;
    try {
      studies.set(project.slug, toStudy(project, project.caseStudy));
    } catch (error) {
      if (!(error instanceof MissingField)) throw error;
      // An incomplete case study builds as a card without a link, not a broken page.
      console.warn(`[sanity] Skipping the "${project.slug}" case study: missing ${error.message}.`);
    }
  }

  const withImages = raw.filter((project) => project.image?.src);
  const hrefFor = (slug: string) => (studies.has(slug) ? `/work/${slug}` : null);

  const cases: WorkCase[] = withImages.map((project, i) => {
    const image = toImage(project.image, "image");
    const services = categories(project.services);
    return {
      index: String(i + 1).padStart(2, "0"),
      name: project.name,
      tag: project.tag ?? "",
      description: project.description ?? "",
      services: services.map((service) => service.name).join(" / "),
      serviceSlugs: services.map((service) => service.slug),
      deliverableSlugs: categories(project.deliverables).map((deliverable) => deliverable.slug),
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
        href: hrefFor(project.slug) ?? "/#work",
        image: toImage(project.image, "image"),
      })),
  }));

  return { cases, studies: caseStudies };
}

let projects: Promise<Projects> | undefined;

function loadProjects(): Promise<Projects> {
  projects ??= sanityClient.fetch<RawProject[]>(PROJECTS_QUERY).then((raw) =>
    raw.length > 0 ? fromSanity(raw) : { cases: placeholderCases, studies: placeholderStudies },
  );
  return projects;
}

export async function getWorkCases() {
  return (await loadProjects()).cases;
}

export async function getCaseStudies() {
  return (await loadProjects()).studies;
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((study) => study.slug === slug);
}
