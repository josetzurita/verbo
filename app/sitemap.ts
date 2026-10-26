import { getCaseStudies } from "../lib/projects";
import { createSitemap } from "../lib/seo";
import { projectConfig } from "../project.config";

export const dynamic = "force-static";

export default async function sitemap() {
  return createSitemap(projectConfig, [
    "/",
    "/work",
    "/privacy",
    "/terms",
    ...(await getCaseStudies()).map((study) => `/work/${study.slug}`),
  ]);
}
