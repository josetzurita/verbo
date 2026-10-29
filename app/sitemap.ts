import { getCaseStudies } from "../lib/projects";
import { createSitemap } from "../lib/seo";
import { projectConfig } from "../project.config";

export const dynamic = "force-static";

export default async function sitemap() {
  const studies = await getCaseStudies();
  // Home and /work list the projects, so they change when the newest one does.
  const latest = studies.reduce<string | undefined>(
    (max, study) => (study.updatedAt && (!max || study.updatedAt > max) ? study.updatedAt : max),
    undefined,
  );
  return createSitemap(projectConfig, [
    { path: "/", lastModified: latest },
    { path: "/work", lastModified: latest },
    { path: "/privacy" },
    { path: "/terms" },
    ...studies.map((study) => ({ path: `/work/${study.slug}`, lastModified: study.updatedAt })),
  ]);
}
