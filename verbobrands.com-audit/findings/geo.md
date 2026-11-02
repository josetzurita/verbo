# GEO and Agent Readiness - verbobrands.com

Audited 2026-10-29 against the live site (Cloudflare, static Next.js export). Pages sampled: `/`, `/work/berry-house/`, `/work/lukatto/` (raw HTML), `/terms/`, `/robots.txt`, `/llms.txt`, `/sitemap.xml`, `/.well-known/*`.

## AI Search Readiness score: 55 / 100

| Dimension | Weight | Score | Weighted |
| --- | --- | --- | --- |
| Citability | 25% | 55 | 13.8 |
| Structural readability | 20% | 60 | 12.0 |
| Multi-modal content | 15% | 60 | 9.0 |
| Authority and brand signals | 20% | 20 | 4.0 |
| Technical accessibility | 20% | 80 | 16.0 |
| **Total** | | | **~55** |

The technical side is strong: the site is server-rendered, crawlable, and has schema and llms.txt. The score is held down by entity and authority gaps: no named people (the team section is placeholder), no sameAs, and no off-site footprint.

### Platform estimates

| Platform | Score | Main limiter |
| --- | --- | --- |
| Google AI Overviews | 45 | Googlebot access is fine. Brand queries for "Verbo" collide with the Spanish word "verbo". Thin E-E-A-T (no people, no dates). |
| ChatGPT Search | 35 | OAI-SearchBot is allowed, but there are no off-site mentions (Bing index, Reddit, LinkedIn) to corroborate the entity. |
| Perplexity | 40 | PerplexityBot is allowed, and the service passages extract cleanly. No third-party sources to cite alongside the site. |
| Bing Copilot | 35 | Bing results for "Verbo Brands" return only dictionary pages for "verbo". The entity is not established. |

## Agentic browsing fraction

**Not computed.** The PageSpeed Insights API returned HTTP 429 (daily quota exceeded) for both mobile and desktop, so the Lighthouse agentic-browsing category could not run. Proxy measurements from a local Playwright run at 1512x982:

- Agent-UX check: **91/100**. It found 4 real buttons, 36 anchors, 23 landmarks, no div-onclick widgets and no unlabeled inputs.
- **2 of 33** interactive nodes have no accessible name at load: "Get to know us" (`#work`) and "Meet the team" (`#team`).
- **~7%** of rendered text (512 of 7,488 characters) is `visibility:hidden` at load, waiting for scroll triggers. This covers the two CTAs and all five team cards.

## AI crawler access (robots.txt)

robots.txt is `User-Agent: * / Allow: / / Disallow: /styleguide`, with a sitemap. Every bot below falls under `*`. Every UA returned 200 from the edge, with no Cloudflare bot block.

| Bot | What it governs | Status |
| --- | --- | --- |
| OAI-SearchBot | ChatGPT Search citations | Allowed |
| Claude-SearchBot | Claude search citations | Allowed |
| PerplexityBot | Perplexity index | Allowed |
| Googlebot | Google Search and AI Overviews | Allowed |
| GPTBot | OpenAI model training (not ChatGPT Search) | Allowed |
| ClaudeBot | Anthropic model training (not Claude search) | Allowed |
| Google-Extended | Gemini/Vertex training and grounding (not AI Overviews) | Allowed |
| Applebot-Extended | Apple Intelligence training (not Siri/Spotlight) | Allowed |
| CCBot | Common Crawl (feeds many training sets) | Allowed |
| cohere-ai | Cohere training | Allowed |

No Content-Signal line. No RSL license (`/license.xml` and `/rsl.xml` return 404).

## llms.txt: present and valid

`/llms.txt` returns 200 `text/plain`. It has an H1, a blockquote summary, Services (7 full passages), Case studies (8 links with one-line summaries), Pages, and Contact. It passes the Lighthouse llms.txt rules. `/llms-full.txt` returns 404 (optional).

## Brand mention analysis

| Signal | Finding |
| --- | --- |
| Wikipedia / Wikidata | None. en and es Wikipedia searches return 0 hits for "Verbo Brands" and "verbobrands". |
| Reddit | No mentions found. Direct search was bot-blocked. |
| YouTube | `youtube.com/@verbobrands` returns 404. No channel found. |
| LinkedIn | `linkedin.com/company/verbobrands` and `/verbo-brands` return 404. |
| Instagram | `instagram.com/verbobrands` returns 200, but that is a login wall, so existence is unconfirmed. |
| Wayback Machine | Zero captures of verbobrands.com. |
| Search engines | Bing results for "Verbo Brands" (with quotes, plus Bogotá or Berry House) return only dictionary pages for the Spanish word "verbo". DuckDuckGo blocked automated queries. |

Conclusion: there is effectively no verifiable off-site entity footprint. Brand mentions, especially on YouTube, Reddit and Wikipedia, correlate far more with AI citation than backlinks do. This is the largest gap.

## What works

- Full SSR and static HTML. All primary content is present without JavaScript (`is_spa: false`). Unknown URLs return a real 404.
- Clear entity line in the title, meta description, llms.txt and JSON-LD: "boutique strategic branding consultancy in Bogotá".
- JSON-LD: `ProfessionalService` (with address, email, logo, knowsAbout) and `WebSite` on every page. Each case adds `CreativeWork` and `BreadcrumbList`, with `creator` linked by `@id`.
- The service passages are strong citable blocks. Each is a self-contained definition of 65-85 words that opens with "X is...", for example "Brand architecture is the organization of the portfolio...".
- Case pages name real clients and context (Hortifruit, four countries, Turismo Al Vuelo, 40 years). Images have descriptive alt text.
- Accessibility tree: one `main`, `banner`, labeled `navigation "Primary"`, skip link, `article` per service, and a list for projects. The menu is a Radix dialog: `aria-labelledby` is set, focus moves into it, Escape closes it, `aria-expanded` toggles, and `main` gets `aria-hidden` while it is open. Decorative cursor and trail elements are not exposed.
- The cookie banner is a labeled `role="dialog"`. Nothing is tracked before consent.
- The sitemap lists all 12 public URLs with lastmod.

## Findings

### 1. Team section shows a placeholder person five times - Critical (entity and trust)
- **Evidence:** `#team` renders "Juliana Cabrera" five times, with roles Strategy, Design, Research, Copy and Direction. Every card has the same quote and the alt "Portrait of Juliana Cabrera, ...". Source: `lib/home-content.ts` lines 117-122.
- **Impact:** AI systems read this as one person with five roles, or as fabricated content. It also undercuts "who runs Verbo", which is otherwise not answered anywhere.
- **Fix:** Replace it with real names and roles from the owner. Do not invent them. Then add `founder` / `employee` `Person` nodes to the Organization JSON-LD and a one-line "Founded by X" sentence in the About copy and llms.txt. Effort: S, once the data exists.

### 2. No off-site entity footprint and no sameAs - High
- **Evidence:** See the brand mention table. JSON-LD has no `sameAs`. The name collides with the common Spanish word "verbo".
- **Fix:** Create and claim a LinkedIn company page, a Google Business Profile (Bogotá), Instagram and Behance. List the case studies on Behance, which works as a portfolio citation source for design queries. Add those URLs to `sameAs` in `project.config.ts`. Always use the disambiguated form "Verbo Brands" or "Verbo, branding consultancy in Bogotá". Earn mentions from client sites (Berry House, Lukatto) and from Colombian design directories or press. Effort: M, ongoing.

### 3. Brand name inconsistency: "Verbo" vs "Verbo Brands" - Medium
- **Evidence:** JSON-LD `name`, `og:site_name` and the title use "Verbo". The About copy and footer use "Verbo Brands". The domain is verbobrands.
- **Fix:** Set `name: "Verbo Brands"` (or keep "Verbo" and add `alternateName: "Verbo Brands"`) in the Organization and WebSite schema. Effort: XS.

### 4. robots.txt contradicts the terms of use on AI training - Medium (policy)
- **Evidence:** `/terms/` says users may not "copy its content at scale with automated tools, or use it to train AI models, without our permission". But robots.txt allows GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended and cohere-ai.
- **Fix:** Decide the policy. If training is not permitted, add Disallow groups for the training bots only. Keep OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot allowed so search citation is unaffected. Also add `Content-Signal: search=yes, ai-input=yes, ai-train=no` under `User-agent: *` (Cloudflare's managed robots.txt can emit this). Note that blocking Google-Extended also removes Gemini grounding. AI Overviews is unaffected. Effort: XS.

### 5. CTA links have no accessible name until scrolled into view - Medium (agentic)
- **Evidence:** `components/underline-link.tsx` sets the label to `autoAlpha: 0` (`visibility:hidden`) until a ScrollTrigger fires. At load, the Playwright accessibility snapshot shows `link` with no name for `#work` ("Get to know us") and `#team` ("Meet the team"). The team cards are hidden the same way (~7% of page text).
- **Fix:** Put `aria-label={children-as-text}` on the anchor, or animate with `opacity` only. Opacity keeps nodes in the accessibility tree, and the transform/opacity rule still holds. Apply the same change to the about cards. Effort: XS.

### 6. Case study H1 is a slogan, not the project name - Medium (citability)
- **Evidence:** On `/work/berry-house/` the H1 is "From the field to your table". "Berry House" appears only in the title, an eyebrow, and the H2 sentence. The other cases most likely follow the same pattern.
- **Fix:** Make the H1 "Berry House" (or "Berry House: rebranding for ...") and keep the slogan as a styled subtitle. Alternatively, add a visually-hidden prefix to the H1. Effort: S, template-level.

### 7. Case studies lack verifiable specifics: no year, outcomes, or numbers - Medium (citability)
- **Evidence:** Berry House has about 578 words of extracted text. It has no project year, no `<time>`, and no quantitative outcome. Every case's `dateModified` is the same build timestamp (2026-10-24T04:22:56Z), and there is no `datePublished`.
- **Fix:** Add a facts row per case (Year, Client, Sector, Country, Scope) and add `datePublished` and `about` (client Organization) to the CreativeWork JSON-LD. Add one or two verifiable results where the client allows it. Effort: S per case, via a Sanity field.

### 8. No Q&A-shaped content for common queries - Low-Medium
- **Evidence:** No question headings anywhere. AI answers for "branding agency Bogotá", "how much does branding cost in Colombia" or "what is a brand book" have no direct-answer passage to lift.
- **Fix:** Add a short FAQ to the home page or `/work` (process, timeline, engagement model, languages served, cities and countries served), each answered in 40-60 words. Effort: S.

### 9. Duplicated desktop and mobile copies in the HTML - Low
- **Evidence:** The projects (8 cards) and the 7 service cards each render twice: the pinned `.work-track` and `.work-reading`. The About paragraphs render twice (`aria-hidden` measure copy plus `md:hidden` copy). Text-only extractors ingest every passage twice. The accessibility tree is fine, because CSS hides one copy.
- **Fix:** This is acceptable. If possible, mark the reading duplicate `aria-hidden` / `data-nosnippet` on the side that is visually hidden. This is a known pattern cost, not a blocker. Effort: S.
- Related: words split into spans run together in raw-HTML extraction ("Ourexpertise", "Strategicnorth", "Averbdoesnotdescribe."). That is covered in the content audit and not repeated here.

### 10. No Markdown delivery and no /.well-known discovery files - Low
- **Evidence:** `Accept: text/markdown` returns HTML. `/index.md` and `/work/lukatto.md` return 404. These all return 404: `/.well-known/security.txt`, `api-catalog`, `agent-card.json`, `mcp.json`, `ai-plugin.json`.
- **Fix:** For a portfolio site, llms.txt already covers most of the value. Optional additions: `/llms-full.txt` (full case text) or per-case `.md` files generated at build. Add `/.well-known/security.txt` (good hygiene). WebMCP, A2A, OAuth and API catalog are not applicable since there are no forms or transactions. Effort: S.

### 11. /styleguide/ returns 200 in production - Verify
- **Evidence:** `curl -I https://verbobrands.com/styleguide/` returned `HTTP/1.1 200`. AGENTS.md says production should 404 unless `ENABLE_STYLEGUIDE=true`. robots.txt disallows it, and the page is meant to be noindexed. The response body was not inspected, so this may be a soft-404 fallback page.
- **Fix:** Confirm the body. If the specimen is live, rebuild without `ENABLE_STYLEGUIDE`. Effort: XS.

## Top 5 highest-impact changes

1. Replace the placeholder team with real people, and add Person/founder schema (Critical, S).
2. Build the off-site entity: LinkedIn, Google Business Profile, Behance, Instagram, then `sameAs` (High, M).
3. Align robots.txt and Content-Signal with the terms: block training bots only and keep search bots (Medium, XS).
4. Case pages: use the project-name H1, a facts row with year/client/country, and `datePublished` (Medium, S).
5. Fix the nameless CTA links by switching to opacity-only reveals or adding aria-label (Medium, XS).

## Structured findings (AI Search Readiness category)

```json
{
  "category": "AI Search Readiness",
  "score": 55,
  "dimensions": {"citability": 55, "structure": 60, "multimodal": 60, "authority": 20, "technical": 80},
  "platforms": {"google_aio": 45, "chatgpt": 35, "perplexity": 40, "bing_copilot": 35},
  "agentic_browsing_fraction": null,
  "agentic_proxy": {"agent_ux_score": 91, "unnamed_interactive_at_load": "2/33", "hidden_text_share_at_load": 0.07},
  "llms_txt": "present_valid",
  "content_signal": "missing",
  "markdown_delivery": "missing",
  "well_known": "none",
  "findings": [
    {"id": "geo-team-placeholder", "severity": "critical", "title": "Team section repeats placeholder 'Juliana Cabrera' x5"},
    {"id": "geo-no-entity-footprint", "severity": "high", "title": "No off-site mentions, no sameAs, name collides with 'verbo'"},
    {"id": "geo-name-inconsistency", "severity": "medium", "title": "Verbo vs Verbo Brands in schema and copy"},
    {"id": "geo-robots-terms-mismatch", "severity": "medium", "title": "robots.txt allows training bots that the terms prohibit; no Content-Signal"},
    {"id": "agent-cta-unnamed", "severity": "medium", "title": "UnderlineLink autoAlpha hides CTA names until scroll"},
    {"id": "geo-case-h1-slogan", "severity": "medium", "title": "Case H1 is a slogan, not the project name"},
    {"id": "geo-case-no-facts", "severity": "medium", "title": "Cases lack year, outcomes and datePublished"},
    {"id": "geo-no-faq", "severity": "low", "title": "No question-shaped answer blocks"},
    {"id": "geo-duplicate-copies", "severity": "low", "title": "Desktop and mobile duplicates double the extracted text"},
    {"id": "agent-no-markdown-wellknown", "severity": "low", "title": "No Markdown negotiation, llms-full.txt or security.txt"},
    {"id": "geo-styleguide-200", "severity": "verify", "title": "/styleguide/ returns 200 in production"}
  ]
}
```
