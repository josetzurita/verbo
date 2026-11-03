import { LegalRoute, legalMetadata } from "@/components/pages/legal-route";

export const metadata = legalMetadata("privacy", "es");

export default function Page() {
  return <LegalRoute slug="privacy" locale="es" />;
}
