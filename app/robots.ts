import { createRobots } from "../lib/seo";
import { projectConfig } from "../project.config";

export default function robots() {
  return createRobots(projectConfig);
}
