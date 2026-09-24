import { NotFoundFoundation } from "../components/not-found-foundation";
import { projectConfig } from "../project.config";

export default function NotFound() {
  return <NotFoundFoundation config={projectConfig} />;
}
