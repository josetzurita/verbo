import { createSitemap } from "../lib/seo";
import { projectConfig } from "../project.config";

export default function sitemap() {
  return createSitemap(projectConfig, ["/", "/work"]);
}
