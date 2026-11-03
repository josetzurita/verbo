import type { Locale } from "./i18n";
import { privacyPolicy, termsOfUse, type LegalDocument } from "./legal-content";
import { privacyPolicyEs, termsOfUseEs } from "./legal-content-es";

export function getLegalDocument(slug: "privacy" | "terms", locale: Locale): LegalDocument {
  if (locale === "es") return slug === "privacy" ? privacyPolicyEs : termsOfUseEs;
  return slug === "privacy" ? privacyPolicy : termsOfUse;
}
