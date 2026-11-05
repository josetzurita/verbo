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

// Accept is remembered on the device. Reject only lasts for the browsing session (sessionStorage), so the banner
// asks again next time the visitor comes back.
function readFrom(storage: () => Storage): ConsentChoice | null {
  try {
    const value = storage().getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentChoice | null {
  return readFrom(() => window.localStorage) ?? readFrom(() => window.sessionStorage);
}

export function storeConsent(choice: ConsentChoice) {
  const keep = choice === "granted";
  try {
    (keep ? window.localStorage : window.sessionStorage).setItem(CONSENT_KEY, choice);
    (keep ? window.sessionStorage : window.localStorage).removeItem(CONSENT_KEY);
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
