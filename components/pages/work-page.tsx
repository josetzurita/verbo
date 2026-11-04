import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { WorkIndex } from "@/components/work-index";
import type { Locale } from "@/lib/i18n";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { createMetadata, jsonLdWebPage } from "@/lib/seo";
import { projectConfig } from "@/project.config";

const pages = {
  en: {
    title: "Branding projects and case studies",
    description:
      "Selected branding projects by Verbo, a boutique consultancy in Bogotá. Filter by service to see strategy, naming, identity and web work.",
    path: "/work",
  },
  // From the translation file, section 1.
  es: {
    // Search-facing only, not shown on the page. Mirrors the English one.
    title: "Proyectos de branding y casos de estudio",
    description:
      "Proyectos de branding de Verbo, agencia boutique de branding estratégico en Bogotá. Filtra por servicio para ver estrategia, naming, identidad y web.",
    path: "/work",
  },
} as const;

export function workMetadata(locale: Locale): Metadata {
  return createMetadata(projectConfig, pages[locale], locale);
}

export async function WorkPage({ locale }: { locale: Locale }) {
  const [cases, services] = await Promise.all([getWorkCases(locale), getServices(locale)]);
  const page = pages[locale];
  return (
    <>
      <JsonLd
        data={jsonLdWebPage(
          projectConfig,
          {
            ...page,
            type: "CollectionPage",
            breadcrumbs: [
              { name: projectConfig.site.name, path: "/" },
              { name: locale === "es" ? "Trabajo" : "Work", path: page.path },
            ],
          },
          locale,
        )}
      />
      <WorkIndex cases={cases} services={services} />
    </>
  );
}
