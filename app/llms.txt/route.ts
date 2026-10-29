import { close } from "../../lib/home-content";
import { getCaseStudies } from "../../lib/projects";
import { getServices } from "../../lib/services";
import { canonicalUrl } from "../../lib/seo";
import { projectConfig } from "../../project.config";

export const dynamic = "force-static";

// A plain-text map of the site for AI assistants (llmstxt.org). Built from the same lib/ exports as the pages.
export async function GET() {
  const [studies, services] = await Promise.all([getCaseStudies(), getServices()]);
  const { site } = projectConfig;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Services",
    "",
    ...services.map((service) => `- ${service.name}: ${service.description}`),
    "",
    "## Case studies",
    "",
    ...studies.map((study) => `- [${study.name}](${canonicalUrl(projectConfig, `/work/${study.slug}`)}): ${study.summary}`),
    "",
    "## Pages",
    "",
    `- [Home](${canonicalUrl(projectConfig)})`,
    `- [Work](${canonicalUrl(projectConfig, "/work")}): all projects, filterable by service`,
    "",
    "## Contact",
    "",
    `- Email: ${close.email}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
