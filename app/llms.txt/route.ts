import { close } from "../../lib/home-content";
import { localePath } from "../../lib/i18n";
import { getCaseStudies } from "../../lib/projects";
import { getServices } from "../../lib/services";
import { canonicalUrl, SITE_DESCRIPTION_ES } from "../../lib/seo";
import { projectConfig } from "../../project.config";

export const dynamic = "force-static";

// A plain-text map of the site for AI assistants (llmstxt.org). Built from the same lib/ exports as the pages.
// English first, then the Spanish site, so assistants can answer and link in either language.
export async function GET() {
  const [studies, services, studiesEs, servicesEs] = await Promise.all([
    getCaseStudies(),
    getServices(),
    getCaseStudies("es"),
    getServices("es"),
  ]);
  const { site } = projectConfig;
  const es = (path: string) => canonicalUrl(projectConfig, localePath("es", path));
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
    "## En español",
    "",
    `> ${SITE_DESCRIPTION_ES}`,
    "",
    "### Servicios",
    "",
    ...servicesEs.map((service) => `- ${service.name}: ${service.description}`),
    "",
    "### Casos de estudio",
    "",
    ...studiesEs.map((study) => `- [${study.name}](${es(`/work/${study.slug}`)}): ${study.summary}`),
    "",
    "### Páginas",
    "",
    `- [Inicio](${es("/")})`,
    `- [Trabajo](${es("/work")}): todos los proyectos, filtrables por servicio`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
