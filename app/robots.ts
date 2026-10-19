import { createRobots } from "../lib/seo";
import { projectConfig } from "../project.config";

export const dynamic = "force-static";

export default function robots() {
  return createRobots(projectConfig);
}
