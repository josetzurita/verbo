import { LegalRoute, legalMetadata } from "@/components/pages/legal-route";

export const metadata = legalMetadata("privacy", "en");

export default function Page() {
  return <LegalRoute slug="privacy" locale="en" />;
}
