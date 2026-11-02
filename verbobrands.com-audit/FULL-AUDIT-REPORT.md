# SEO audit - verbobrands.com

Audited October 29, 2026, right after launch. Lab data only. Google API, CrUX, Matomo and backlink data weren't available, and Search Console has no data yet. The per-category detail is in `findings/`.

## Executive summary

**SEO Health Score: 65 / 100**

**Business type:** agency and professional services. Verbo is a boutique branding consultancy in Bogotá with 8 case studies and no blog.

| Category | Weight | Score |
| --- | --- | --- |
| Technical SEO | 22% | 82 |
| Content Quality | 23% | 52 |
| On-Page SEO | 20% | 63 |
| Schema / Structured Data | 10% | 78 |
| Performance (CWV) | 10% | 68 |
| AI Search Readiness | 10% | 55 |
| Images | 5% | 52 |

The technical base is solid: redirects, canonicals, the sitemap, server-rendered HTML and the JSON-LD all work. Most of the lost points come from the content: placeholder team copy, headings whose words run together for crawlers, and no proof or authority signals. The rest comes from one performance problem, the intro loader's full-size photos.

### Top 5 issues
1. **Critical:** the team section is a placeholder. "Juliana Cabrera" appears five times, with five roles.
2. **High:** headings lose their word spaces in the raw HTML. The H1 reads "Creatingtoshapetheworld." and the footer H2 on every page reads "yoursdeserves".
3. **High:** the intro loader waits on 8 full-size photos, about 3.1 MB. In the lab, home LCP is 20.9s on mobile and 5.3s on desktop.
4. **High:** nothing is cached long-term, not even Next's hashed `/_next/static` files. All responses are `max-age=0`.
5. **High:** there is no off-site footprint: no Google Business Profile, no LinkedIn, no directory listings and no `sameAs`. "Verbo" is also a common Spanish word.

### Top 5 quick wins
1. Add `public/_headers` with immutable caching for `/_next/static/*` and basic security headers.
2. Put real spaces between the word spans in the animated headings.
3. Replace the five placeholder cards with one real founder card.
4. Remove `/styleguide/` from the production output so it returns a real 404.
5. Convert `about/portrait.png` (795 KB) and `belief/*.png` to WebP, and drop their below-the-fold preloads.

## Technical SEO - 82
**Works:**
- `http` and `www` both 301 to the https apex.
- All 12 sitemap URLs return 200, point to themselves as canonical, and are indexable.
- Unknown URLs return a real 404 with noindex.
- All content is in the raw HTML, and the sitemap matches the internal links.

**Issues:**
- **High:** there are no security headers.
- **High:** there is no long-term asset caching.
- **Medium:** `/styleguide/` returns 200 with a "Page not found" body (a soft 404).
- **Medium:** the 404 page has two robots tags, and its og:url points to the home page.
- **Low:**
  - Slash-less URLs redirect with 307. This is Cloudflare's behavior, and internal links already avoid it.
  - robots.txt has the deprecated `Host:` line.
  - There is no IndexNow key.

See `findings/technical.md`.

## Content quality - 52
**Works:**
- The eight case bodies are genuinely distinct, with at most 1.8% overlap between any two.
- Real clients are named, and six cases link to live client sites.
- The service texts work as self-contained definitions.

**Issues:**
- **Critical:** the team section is a placeholder.
- **High:** no case shows a year, a client quote or a measurable result.
- **High:** there are no service pages. Naming is the clearest gap, since Verbo named Albora, Altalba, Lienzo, Autip and Lukatto.
- **High:** there are no outside authority signals.
- **Medium:** the home page puts its projects and services copy in the HTML twice, once for desktop and once for mobile.
- **Medium:** `/work/` is thin.
- **Medium:** the site is English-only. A Spanish version is planned.

E-E-A-T scores 43:

| Signal | Score |
| --- | --- |
| Experience | 60 |
| Expertise | 40 |
| Authoritativeness | 25 |
| Trust | 50 |

See `findings/content.md`, which also has the search-intent (SXO) table.

## On-page SEO - 63
**Works:**
- Every page has a unique title and description.
- Every page has one H1.
- Internal linking is complete.

**Issues:**
- **High:** headings lose their word spaces.
- **High:** the home H1 includes the "Schedule a free discovery session" CTA and no topic term.
- **Medium:** case and `/work/` titles carry no search terms.
- **Medium:** case H1s are slogans rather than the project name.

## Schema - 78
**Works:**
- The JSON-LD is valid and server-rendered.
- The `ProfessionalService`, `WebSite`, `CollectionPage`, `CreativeWork` and `BreadcrumbList` entries link correctly by `@id`.

**Gaps:**
- No telephone, `areaServed` or `contactPoint`.
- The `CreativeWork` has no `@id`, no `mainEntityOfPage` and no project dates.
- There is no founder `Person`.
- `sameAs` is left out on purpose, until profiles exist.

`findings/schema.md` has ready-to-use snippets for these.

## Performance - 68
| Page | Mobile | Desktop |
| --- | --- | --- |
| Home | 67 (LCP 20.9s) | 75 (LCP 5.3s) |
| /work/lukatto/ | 78 (LCP 4.6s) | 93 (LCP 1.7s) |

**Works:**
- CLS is 0 everywhere.
- TBT is 10-210ms.
- Fonts are self-hosted.
- Case pages serve AVIF with blur placeholders.

**Fixes:**
- Make the intro loader request smaller photos (800-1200px, `auto=format`) and wait only for the first one.
- Cap the close-section plates near 480px wide. They are about 2.3 MB on desktop now.
- Make the first case image load eagerly, without the fade-in.

**Note for the privacy policy:** Cloudflare injects its Web Analytics beacon. It sets no cookies, and the policy already lists Cloudflare as a provider. If you keep Cloudflare Web Analytics on, add one line saying Cloudflare also collects cookieless visit statistics.

See `findings/performance.md`.

## Images - 52
**Works:**
- Alt text is complete.
- Images have dimensions set, so they cause no layout shift.

**Issues:**
- `about/portrait.png` is 795 KB at 605x908.
- The three `belief/sequence-*.png` files total about 640 KB and are preloaded even though they're below the fold.
- The plate WebP files are oversized for how small they display.

## AI search readiness - 55
**Works:**
- Every AI crawler gets the full server-rendered HTML.
- `llms.txt` is valid.
- The agent-friendliness check scored 91/100.
- The menu dialog is accessible to agents.

**Issues:**
- There are no entity or authority signals (the team placeholder, no off-site presence).
- The terms forbid AI training, but robots.txt allows training crawlers. Decide which one should change.
- Two CTA links have no accessible name until they scroll into view, because of `autoAlpha: 0` in `underline-link.tsx`.
- Brand naming is inconsistent: "Verbo" in some places, "Verbo Brands" in others.

| Platform | Estimate |
| --- | --- |
| Google AI Overviews | 45 |
| Perplexity | 40 |
| ChatGPT | 35 |
| Bing Copilot | 35 |

See `findings/geo.md`.

## Limitations
- The PageSpeed Insights API was over its daily quota, so the agentic browsing fraction couldn't be computed. It was estimated with a local Playwright run instead.
- Off-site brand searches were partly blocked by captchas.
- The search-intent page types are typical patterns and weren't checked against live Colombian search results.
- The sitemap and schema show one shared `dateModified` because every case was imported into Sanity at once. This isn't a bug, and it will diverge as cases are edited.

## Screenshots
`screenshots/` has above-the-fold captures at desktop 1512x982 and mobile 390x844, plus a frame of the loader at 1.2s. On desktop the cookie banner overlaps the "v" of the wordmark.
