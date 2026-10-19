import { createWebManifest } from "../lib/seo";
import { projectConfig } from "../project.config";

export const dynamic = "force-static";

export default function manifest() {
  return createWebManifest(projectConfig);
}
