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
    title: "Nuestro trabajo",
    description: "Ocho proyectos de marca que muestran cómo trabajan juntos la estrategia y la identidad.",
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
