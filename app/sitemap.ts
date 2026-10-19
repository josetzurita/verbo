import { caseStudies } from "../lib/case-study";
import { createSitemap } from "../lib/seo";
import { projectConfig } from "../project.config";

export const dynamic = "force-static";

export default function sitemap() {
  return createSitemap(projectConfig, [
    "/",
    ...caseStudies.map((study) => `/work/${study.slug}`),
  ]);
}
