import type { Metadata } from "next";
import { NotFoundFoundation, type NotFoundProject } from "@/components/not-found-foundation";
import imageLoader from "@/lib/image-loader";
import type { Locale } from "@/lib/i18n";
import { getCaseStudies, getWorkCases } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
import { projectConfig } from "@/project.config";

const copy = {
  en: { title: "Page not found", description: "This page does not exist. Head back to the Verbo home page." },
  es: { title: "Página no encontrada", description: "Esta página no existe. Vuelve a la página de inicio de Verbo." },
} as const;

// Next already adds its own noindex to the 404, so a second robots tag would only conflict. The page has
// no address of its own, so og:url is dropped rather than pointing at the home page.
export function notFoundMetadata(locale: Locale): Metadata {
  const base = createMetadata(projectConfig, { ...copy[locale], noIndex: true }, locale);
  return {
    ...base,
    robots: undefined,
    openGraph: { ...base.openGraph, url: undefined },
  };
}

const MAX_IMAGES = 40;

// Every image object in a case study ({ src, focus? }), whichever field it sits in.
function collectImages(value: unknown, into: NotFoundProject[]) {
  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, into);
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.src === "string") {
    into.push({ src: record.src, focus: typeof record.focus === "string" ? record.focus : undefined });
    return;
  }
  for (const child of Object.values(record)) collectImages(child, into);
}

export async function NotFoundPage({ locale }: { locale: Locale }) {
  const [cases, studies] = await Promise.all([getWorkCases(locale), getCaseStudies(locale)]);
  const images: NotFoundProject[] = cases.map((project) => ({ src: project.image, focus: project.focus }));
  collectImages(studies, images);

  const seen = new Set<string>();
  const projects = images
    .filter((image) => !seen.has(image.src) && Boolean(seen.add(image.src)))
    .slice(0, MAX_IMAGES)
    .map((image) => ({ ...image, src: imageLoader({ src: image.src, width: 480 }) }));

  return <NotFoundFoundation projects={projects} />;
}
