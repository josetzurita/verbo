import { NotFoundPage, notFoundMetadata } from "@/components/pages/not-found-page";

// Spanish 404. scripts/prune-export.mjs moves the built page to out/es/404.html so Cloudflare serves it for /es/*.
export const metadata = notFoundMetadata("es");

export default function Page() {
  return <NotFoundPage locale="es" />;
}
