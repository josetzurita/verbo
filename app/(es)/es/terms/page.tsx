import { LegalRoute, legalMetadata } from "@/components/pages/legal-route";

export const metadata = legalMetadata("terms", "es");

export default function Page() {
  return <LegalRoute slug="terms" locale="es" />;
}
