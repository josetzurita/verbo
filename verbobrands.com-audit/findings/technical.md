# Technical SEO - verbobrands.com (audited 2026-10-29)

**Technical score: 82 / 100**

Category status: Crawlability PASS | Indexability PASS (1 soft-404) | Security FAIL (no security headers) | URL/redirects PASS | Mobile PASS | CWV (lab estimate) NEEDS WORK | Structured data PASS | JS rendering PASS | IndexNow NOT IMPLEMENTED

## What works
- HTTP -> HTTPS 301 and www -> apex 301 are live. http://www.verbobrands.com/work resolves in 2 hops (301 to https://verbobrands.com/work, then 307 to /work/).
- Unknown URLs return a real HTTP 404 (`/nonexistent-xyz/`, `/Work/`, `/index.html`, `/indexnow.txt`) with `noindex` and a custom page.
- All 12 sitemap URLs return 200, are self-canonical with trailing slash, `index, follow`, one H1, `lang="en"`, viewport meta (`width=device-width, initial-scale=1, viewport-fit=cover`), unique titles and descriptions, OG and Twitter cards. Case studies carry CreativeWork + BreadcrumbList JSON-LD; every page has the ProfessionalService/Organization graph.
- Content is server-rendered into raw HTML (case page ~700 words of text, H1/H2s, 55 img tags all with alt). Not a CSR shell.
- Brotli enabled, HTTP/3 advertised, Cloudflare cache HIT on pages.
- Sitemap is valid XML, correct namespace, absolute https apex URLs, trailing slashes matching canonicals, no duplicates, `/styleguide` excluded. robots.txt references it. llms.txt present and accurate.
- GA4 not in raw HTML (consent-gated).

## Findings

### 1. [High] No security headers at all
Evidence: response headers on `/` contain none of Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options / frame-ancestors, Referrer-Policy, Permissions-Policy, Content-Security-Policy.
Fix: add `public/_headers` (Workers static assets support it) for `/*`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Start CSP as Report-Only (allow cdn.sanity.io images, Google Analytics hosts, Next inline scripts). HSTS is deferred by choice: when ready, start at `max-age=300`, then raise to 31536000; add `includeSubDomains` only after confirming all subdomains serve HTTPS.

### 2. [High] Hashed static assets are not cached long-term
Evidence: `/_next/static/css/0991f74c0ada6463.css`, `/_next/static/media/*.woff2` and `/og.png` all return `Cache-Control: public, max-age=0, must-revalidate`.
Impact: every repeat visit revalidates ~35+ JS chunks, CSS and 5 fonts; hurts repeat-view load and wastes requests.
Fix: in `public/_headers`: `/_next/static/*` -> `Cache-Control: public, max-age=31536000, immutable`; images and icons in `/belief/*`, `/og.png`, `/icon-*` -> `max-age=86400` or longer. Keep HTML at `max-age=0, must-revalidate`.

### 3. [Medium] /styleguide/ returns HTTP 200 with a "Page not found" body (soft 404)
Evidence: `curl -I https://verbobrands.com/styleguide/` -> `200 OK`; body is `<title>Page not found - Verbo</title>`, `<html id="__next_error__">`, `noindex`. Contradicts "404 in production". Unknown URLs do give 404, so only this exported path is affected. robots.txt also disallows `/styleguide`, so crawlers may never see the noindex.
Impact: low real risk (noindex, disallowed, not in sitemap or nav) but a soft-404 candidate if ever discovered.
Fix: delete `out/styleguide/` after build (postbuild `rm -rf out/styleguide`) or exclude the route from export so Workers falls through to 404.html. Re-test for 404.

### 4. [Medium] Heavy pages and many scripts (CWV risk)
Evidence (uncompressed raw HTML): home 236 KB, case studies 295-330 KB (RSC payload inlined), 36-75 `<script>` tags per page. Home has 58 images, five `<link rel=preload as=image>` to cdn.sanity.io plus 5 font preloads, and a single `loading="lazy"`.
Lab estimate (source inspection only; no Lighthouse run): LCP about 2.0-3.2s on mobile (hero is gated by a GSAP load timeline; case pages likely have a large Sanity image as LCP). INP probably good (<200ms) but GSAP/ScrollTrigger/Lenis scroll work is a risk. CLS probably <0.1 but verify the pinned `.work-track` and sticky spacers. Unverified; check PageSpeed Insights / CrUX.
Fix: preload only the single LCP image and give it `fetchPriority="high"`; lazy-load below-fold images; dynamic-import GSAP plugins for below-fold sections; confirm with Lighthouse mobile.

### 5. [Medium] Duplicate robots meta and wrong og:url on 404 pages
Evidence: `/nonexistent-xyz/` and `/styleguide/` include both `<meta name="robots" content="noindex"/>` and `<meta name="robots" content="noindex, nofollow"/>`; og:url points to the home page.
Fix: emit a single robots tag from `app/not-found.tsx` metadata; omit og:url/canonical on the 404.

### 6. [Low] Slash-less URLs redirect with 307
Evidence: `/work` -> `307 /work/`, `/work/albora` -> `307 /work/albora/`. Internal links and canonicals already use slashes, so impact is minimal.
Fix: acceptable (Workers auto-trailing-slash behaviour). Optionally add a Cloudflare redirect rule to make it 301.

### 7. [Low] Case-study social metadata
Evidence: case pages use `og:type=website` and an `og:image` on cdn.sanity.io without `og:image:width/height` (home and /work/ have them).
Fix: add width/height, consider `og:type=article`, and request the Sanity image at `?w=1200&h=630&fit=crop`.

### 8. [Low] Sitemap lastmod quality
Evidence: 10 URLs share `2026-10-24T04:22:56Z` (bulk import); `/privacy/` and `/terms/` have no lastmod. No changefreq/priority (correct). Home and /work/ lastmod mirror the same date.
Impact: uniform dates carry little signal but are harmless; do not bump without real content change.
Fix: set legal-page lastmod to the real policy revision date; set home and /work/ to the max case `_updatedAt`; dates will diverge naturally as cases are edited.

### 9. [Low] robots.txt details
Evidence: `User-Agent: *`, `Allow: /`, `Disallow: /styleguide`, `Host: https://verbobrands.com`, `Sitemap: https://verbobrands.com/sitemap.xml`. Valid. `Host:` is a deprecated Yandex-only directive; no AI-crawler policy.
Fix: remove `Host:`; decide explicitly on GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot; use `Disallow: /styleguide/`.

### 10. [Low] No IndexNow
Evidence: `/indexnow.txt` returns 404; no key file or submission wiring found.
Fix: generate a key, publish `public/<key>.txt` containing it, and POST changed URLs to `https://api.indexnow.org/indexnow` (host, key, keyLocation, urlList) from the deploy or Sanity publish webhook. Helps Bing, Yandex, Naver, Seznam (not Google).

### 11. [Info] hreflang / language
`<html lang="en">` everywhere, `og:locale=en_US`, no hreflang. Consistent for a single-language site. If a Spanish version is added, use `/es/` paths with reciprocal hreflang (see seo-hreflang).

### 12. [Info] Sitemap coverage vs internal links
12 URLs = home, /work/, /privacy/, /terms/ and 8 case studies. All are linked internally (14 pages link /work/, 10 link each case, 9 link /privacy/ and /terms/). No orphans, no internal page links missing from the sitemap. Query strings (`/?utm=1`) return 200 with clean canonical. `/.well-known/security.txt` is 404 (optional).

## Priority order
1. Security headers via `_headers` (1)
2. Immutable caching for `/_next/static/*` (2)
3. Fix `/styleguide/` soft 404 (3)
4. Measure CWV, trim preloads and scripts (4)
5. 404 meta cleanup (5), legal-page lastmod (8), IndexNow (10)

Method: live curl checks on 2026-10-29 (headers, redirects, HTML parsing). No browser render or Lighthouse was run, so CWV values are estimates. No project files were modified.
