# Performance and images audit - verbobrands.com

Date: 2026-10-29. Tool: Lighthouse 13.6.0 (npx, headless Chrome, default throttling: mobile = Slow 4G + 4x CPU, desktop preset). Lab data only; no CrUX/API key, so these are single runs, not field data. Pages: `/` and `/work/lukatto/`.

## Scores

- **Performance score: 68 / 100** (home mobile 67, home desktop 75, case mobile 78, case desktop 93; the home page pulls the average down)
- **Images score: 52 / 100**

## Metrics

| Page / device | Perf | FCP | LCP | TBT | CLS | Transfer | Requests |
|---|---|---|---|---|---|---|---|
| Home mobile | 67 | 2.0s | **20.9s (poor)** | 210ms | 0 | 4.25 MB | 45 |
| Home desktop | 75 | 0.9s | **5.3s (poor)** | 90ms | 0 | 7.05 MB | 60 |
| Case (lukatto) mobile | 78 | 1.4s | **4.6s (poor)** | 100ms | 0 | 0.70 MB | 60 |
| Case (lukatto) desktop | 93 | 0.7s | 1.7s (good) | 10ms | 0 | 2.93 MB | 66 |

INP cannot be measured in the lab; TBT is the proxy and is good to fair (10-210ms). Long tasks on home mobile: 174ms (chunk 255-*.js), 99ms (chunk 4bd1b696-*.js), 86ms (inline in HTML). Forced reflow about 38ms from chunk 255 (GSAP). Server response is fast (root doc 100-140ms, TTFB about 190-230ms, Cloudflare HIT, Brotli).

LCP breakdown (home mobile): TTFB 191ms, load delay 5ms, load duration 656ms, **element render delay 1,390ms**. Case mobile: render delay 1,742ms of 4.6s. LCP is gated by the intro loader / JS-driven reveal, not by network alone (F1, F8).

## What works

- CLS is about 0 on both pages and devices (one 0.00003 shift on the hidden loader counter). All `<img>` have width/height; unsized-images passes.
- Server and edge are good: fast TTFB, Cloudflare cache HIT, Brotli on HTML, HTTP/3.
- Fonts: Figtree via `next/font` (self-hosted, 5 woff2 files, about 85 KB total, preloaded, swap behavior; font-display insight passes). No font CLS.
- Third parties are minimal: only the Cloudflare Web Analytics beacon (10 KB). GA4/gtag is not loaded before consent (no googletagmanager request on load).
- Case pages use `CasePhoto`: AVIF from Sanity CDN (`?w=1080&q=85&auto=format`), 4-width srcset, lazy loading, LQIP. Case mobile transfer is only 0.70 MB; image-delivery savings just 146 KiB.
- Accessibility 93-96, Best Practices 100, SEO 100. All 58 home `<img>` have an `alt` attribute; content images have descriptive alt; empty alt only on decorative images.
- One render-blocking CSS file (16 KB), small.

## Findings

### F1 - HIGH: Intro loader preloads and waits for 8 full-size Sanity originals (LCP 20.9s mobile / 5.3s desktop)
Evidence: the HTML has `<link rel="preload" as="image">` and `<img class="intro-shot">` for 8 untransformed Sanity URLs, e.g. `cdn.sanity.io/images/3bttmpaw/production/f5807f13...-2500x1669.jpg` (770 KB), 535, 456, 363, 287, 249, 224, 203 KB: about 3.1 MB of 2300-2500px JPEG with no `?w=` or `auto=format`. `components/intro-loader.tsx` (about line 148) calls `image.decode()` on every shot and progress advances as all of them plus `document.fonts.ready` resolve (`total = images.length + 1`). The preloads also compete with CSS, fonts and JS. Lighthouse lcp-discovery: no `fetchpriority=high`. Image-delivery insight: 3.7 MB savings mobile, 6.2 MB desktop.
Fix: route intro shots through the Sanity loader used by `CasePhoto` at 800-1200w, `auto=format`, q 70-75 (they flash at 0.16s per cut). Preload only the first with `fetchpriority="high"`, drop the other 7 preloads, and gate the loader on the first frame (or a short timeout) rather than all 8 decodes. Expected mobile LCP: about 20s to under 4s.

### F2 - HIGH: No long-term caching on any asset (`Cache-Control: public, max-age=0, must-revalidate`)
Evidence: curl on `/_next/static/media/*.woff2`, `/_next/static/css/*.css`, `/belief/sequence-1.png`, `/about/portrait.png`, `/close/frames/*.webp` all return `max-age=0, must-revalidate`. No `_headers` file in `public/` or `out/`. Every repeat visit and route transition revalidates chunks, fonts and images.
Fix: add `public/_headers`: `/_next/static/*` -> `Cache-Control: public, max-age=31536000, immutable`; image folders (`/close/*`, `/belief/*`, `/about/*`, `/case/*`, `/work/*`) -> `public, max-age=2592000` (or immutable if renamed on change). Keep HTML at `max-age=0, must-revalidate`.

### F3 - HIGH: Oversized static PNGs in `public/`
Evidence:
- `/about/portrait.png`: 795 KB for a 605x908 RGB PNG (735 KB savings; also used by the cursor trail).
- `/belief/sequence-1/2/3.png`: 218, 143, 280 KB for 496x304, 597x311, 787x334 RGBA (about 640 KB), all three preloaded in `<head>` though `#belief` is below the fold.
- `/cursor-trail/*.png` (1.5 MB in repo), `/close/whatsapp.png` (49 KB, fetched on case mobile).
Fix: convert to WebP/AVIF (portrait about 40-60 KB, sequence about 15-30 KB each), serve via `ResponsiveImage`, and remove the three belief preloads.

### F4 - MEDIUM: Close-section floating plates download large files on desktop (about 2.3 MB)
Evidence: desktop home fetches 12+ `/close/frames/*.webp`: 361 KB (`04-classical-facade-square`), 269, 225, 214, 181, 178, 172, 131, 123 KB, though they display at 160-220 px (`sizes="160px"/"220px"`). Lighthouse estimates 120-366 KB waste each. Home desktop is 7.05 MB vs 4.25 MB mobile.
Fix: cap generated widths at about 480 (DPR 2), re-encode at q 70. Should remove about 1.5-2 MB.

### F5 - MEDIUM: Intro and work cards use different URLs for the same photos
Evidence: work cards use `?w=750&q=75&auto=format` (still 15-22 KB over need each), but intro shots are different untransformed URLs, so no cache sharing.
Fix: use the same transformed URL in the intro so it warms the cache for the cards.

### F6 - MEDIUM: Main-thread cost on mobile
Evidence: render-blocking `/_next/static/css/0991f74c0ada6463.css` (16 KB, est. 108-223 ms). Chunk `255-*.js` (46 KB, 45% unused, forced reflow), `4bd1b696-*.js` (55 KB). Home mobile TBT 210ms, 3 long tasks.
Fix: sizes are acceptable. Optionally inline critical CSS and dynamically import work-stage/close/cursor code so GSAP pin setup does not run in the first 2 s on mobile (mobile uses the reading layout anyway).

### F7 - LOW: Cloudflare Web Analytics beacon
Evidence: `beacon.min.js` 10 KB with 1-day cache plus a `/cdn-cgi/rum` request. Negligible for performance. It loads without consent while GA4 is consent-gated (policy consistency, not speed).

### F8 - LOW: Case page LCP tied to reveal animation
Evidence: case mobile LCP 4.6s with 1.74s render delay despite a 75 KB AVIF hero. The `w=1080` image is shown at about 424 CSS px (about 67 KB waste); desktop gets `w=2560` (211 KB).
Fix: make the first case image `priority` (eager, `fetchpriority=high`) and do not hide it behind an opacity-0 reveal; add a `sizes` with a 640w candidate for mobile.

## Images checklist

| Check | Result |
|---|---|
| Alt coverage | 58/58 home `<img>` have alt: 13 descriptive, 45 empty (decorative). OK. |
| Formats | Case pages AVIF (good). Home: 8 raw JPEG originals (bad); work cards AVIF via loader (ok); PNG for belief, portrait, cursor-trail, whatsapp, og (bad); close frames WebP (ok, oversized). |
| Oversized | Intro shots, portrait.png, sequence PNGs, close frames at 160-220px display. |
| Lazy loading | Good for below-fold work, team, close. Wrong: the 8 intro shots and 3 belief PNGs are preloaded and compete with LCP/CSS/fonts. |
| width/height | All set; CLS 0. |
| Responsive srcset | Present on work, case, team, close; absent on intro and belief. |

## Priority order

1. F1 intro loader images and gating (largest mobile LCP win).
2. F2 `_headers` with immutable caching for `/_next/static/*`.
3. F3 convert portrait and sequence PNGs, drop belief preloads.
4. F4 shrink close-frames.
5. F8, F6, F5.

## Screenshots

In `verbobrands.com-audit/screenshots/`: `home-desktop-atf.png` (1512x982), `home-mobile-atf.png` (390x844 at 2x), plus `home-*-loader-1.2s.png` during the intro. Desktop at about 9s shows headline, CTA, nav and the "verbo." wordmark; the cookie banner (bottom-left) overlaps the "v". Mobile shows menu button, headline, copy and CTA with the banner covering the lower part; the wordmark is not visible above the fold.
