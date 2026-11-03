import { LegalRoute, legalMetadata } from "@/components/pages/legal-route";

export const metadata = legalMetadata("terms", "en");

export default function Page() {
  return <LegalRoute slug="terms" locale="en" />;
}
