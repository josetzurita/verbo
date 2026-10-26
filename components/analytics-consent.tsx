"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_KEY,
  CONSENT_OPEN_EVENT,
  gaId,
  readConsent,
  storeConsent,
  updateGaConsent,
  type ConsentChoice,
} from "@/lib/analytics";

// The GA4 script loads only after the visitor accepts, so a visitor who rejects or never answers sends nothing
// to Google. Consent Mode v2 still starts every storage type denied and grants analytics only from the stored
// choice, so a later Reject (from the footer link) stops cookies for the rest of the visit.
// Nothing renders and nothing loads while no GA id is set.
const consentDefault = `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});try{var c=localStorage.getItem('${CONSENT_KEY}');if(c==='granted'||c==='denied'){gtag('consent','update',{analytics_storage:c})}}catch(e){}gtag('event','page_view');`;

const buttonClass =
  "flex-1 border border-foreground px-5 py-3 text-[0.6875rem] uppercase tracking-[0.12em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [open, setOpen] = useState(false);
  // The first page_view comes from the init script; later route changes send their own.
  const firstPath = useRef(true);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setOpen(stored === null);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!gaId) {
    return null;
  }

  function decide(next: ConsentChoice) {
    storeConsent(next);
    updateGaConsent(next);
    setChoice(next);
    setOpen(false);
  }

  return (
    <>
      {choice === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
          >
            {consentDefault}
          </Script>
        </>
      ) : null}
      {open ? (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] border border-foreground bg-background p-5 text-foreground md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm"
        >
          <p className="type-body-sm text-copy">
            We use cookies to measure how the site is used. Nothing is tracked unless you accept.{" "}
            <a className="text-foreground underline underline-offset-4" href="/privacy">
              Privacy policy
            </a>
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" className={buttonClass} onClick={() => decide("denied")}>
              Reject
            </button>
            <button type="button" className={buttonClass} onClick={() => decide("granted")}>
              Accept
            </button>
          </div>
          {choice ? (
            <p className="mt-3 text-[0.6875rem] text-copy">
              Current choice: {choice === "granted" ? "accepted" : "rejected"}.
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
