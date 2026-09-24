import { createWebManifest } from "../lib/seo";
import { projectConfig } from "../project.config";

export default function manifest() {
  return createWebManifest(projectConfig);
}
