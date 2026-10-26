// GA4 Measurement ID ("G-XXXXXXXXXX"), inlined at build time. Empty means no analytics script and no consent banner.
export const gaId = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();

export const CONSENT_KEY = "verbo-consent";
export const CONSENT_OPEN_EVENT = "verbo:open-consent";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

export function updateGaConsent(choice: ConsentChoice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
