import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { WorkIndex } from "@/components/work-index";
import { getWorkCases } from "@/lib/projects";
import { getServices } from "@/lib/services";
import { createMetadata, jsonLdWebPage } from "@/lib/seo";
import { projectConfig } from "@/project.config";

const page = {
  title: "Branding projects and case studies",
  description: "Selected branding projects by Verbo, a boutique consultancy in Bogotá. Filter by service to see strategy, naming, identity and web work.",
  path: "/work",
};

export const metadata: Metadata = createMetadata(projectConfig, page);

export default async function WorkPage() {
  const [cases, services] = await Promise.all([getWorkCases(), getServices()]);
  return (
    <>
      <JsonLd
        data={jsonLdWebPage(projectConfig, {
          ...page,
          type: "CollectionPage",
          breadcrumbs: [
            { name: projectConfig.site.name, path: "/" },
            { name: "Work", path: page.path },
          ],
        })}
      />
      <WorkIndex cases={cases} services={services} />
    </>
  );
}
