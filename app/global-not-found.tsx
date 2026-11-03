import { NotFoundPage, notFoundMetadata } from "@/components/pages/not-found-page";
import { RootDocument } from "@/components/root-document";

// With one root layout per language there is no shared layout, so unmatched URLs render this full document.
// It is English; the Spanish 404 lives at app/(es)/es/404 and is served for /es/* by prune-export.
export const metadata = notFoundMetadata("en");

export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <NotFoundPage locale="en" />
    </RootDocument>
  );
}
