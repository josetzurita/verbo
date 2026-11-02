# Content Quality and On-Page Audit - verbobrands.com

Audited: 2026-10-29. Method: raw HTML fetched with curl for all 12 sitemap URLs (static export, so no render was needed). Text was extracted from the HTML with scripts and navigation removed, then checked for headings, metadata, links, JSON-LD, 5-gram duplication across case studies, Flesch readability, and `metadata_template.py` (heuristic) across all title and description pairs. Source checked read-only: `lib/home-content.ts`, `project.config.ts`, `docs/case-study-template.md`.

## Scores

| Score | Value |
| --- | --- |
| **Content score** | **52 / 100** |
| **On-Page score** | **63 / 100** |
| E-E-A-T (weighted) | 43 / 100 |
| AI citation readiness | 55 / 100 |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Why |
| --- | --- | --- | --- |
| Experience | 20% | 60 | 8 real, named client projects. Real parent companies are named (Hortifruit, Arias Serna Saravia, COL Management Group, Turismo Al Vuelo), and 6 cases have "Visit site" links to the live client sites. No dates, outcomes, testimonials or process artefacts. |
| Expertise | 25% | 40 | Service definitions are thoughtful and specific. No named practitioner with credentials, years or background. The team section is a placeholder. |
| Authoritativeness | 25% | 25 | No awards, press, client quotes, client logo wall, directory profiles or social profiles. No `sameAs` in the schema. |
| Trustworthiness | 30% | 50 | Privacy and terms are solid: legal name "Juliana Cabrera Bonilla, trading as Verbo Brands", phone, email and dates. Undermined by the team placeholder repeated five times, no visible address and no contact page. |

Weighted: 0.2x60 + 0.25x40 + 0.25x25 + 0.3x50 = 43.

### Page inventory

| URL | Words (raw / unique body) | Title (chars) | Description (chars) | H1 |
| --- | --- | --- | --- | --- |
| / | 2,217 / about 1,100 (projects and services render twice) | Strategic branding consultancy in Bogotá - Verbo (48) | 141 | 1 (contains CTA link) |
| /work/ | 367 | Work - Verbo (12) | 136 | 1 |
| /work/altos-de-guayacanes/ | 676 / 557 | Altos de Guayacanes, case study - Verbo (39) | 89 | 1 |
| /work/lukatto/ | 678 / 556 | Lukatto, case study - Verbo (27) | 105 | 1 |
| /work/altalba-del-camino/ | 708 / 590 | Altalba del Camino, case study - Verbo (38) | 95 | 1 |
| /work/berry-house/ | 691 / 578 | Berry House, case study - Verbo (31) | 99 | 1 |
| /work/albora/ | 711 / 590 | Albora, case study - Verbo (26) | 97 | 1 |
| /work/lienzo/ | 705 / 583 | Lienzo, case study - Verbo (26) | 93 | 1 |
| /work/autip/ | 733 / 612 | Autip, case study - Verbo (25) | 103 | 1 |
| /work/cruise-on-land/ | 734 / 610 | Cruise On Land, case study - Verbo (34) | 94 | 1 |
| /privacy/ | 1,015 | Privacy policy - Verbo (22) | 135 | 1 |
| /terms/ | 518 | Terms of use - Verbo (20) | 79 | 1 |

All pages: `index, follow`, self-canonical, `lang="en"`, og:image present (case studies use their own Sanity cover).

## What works

- **Metadata is unique and hand-written.** `metadata_template.py` over 12 pairs: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, no echo or brand-suffix flags. No page shares a title or description.
- **Case-study body copy is genuinely unique.** The 5-word shingle Jaccard between case bodies has a mean of 0.4% and a max of 1.8% (Altalba vs Albora). There is no duplicate-content risk at the text level.
- **Real client proof exists.** Named parent companies, real locations (127 Boyacá, Punta Cana, four countries) and concrete figures in places (Cruise On Land: "11 million visitors a year", "860,000 square meters", "100+ attractions"; Lienzo: "40 years").
- **One H1 per page.** Case-study heading hierarchy is logical: H1 title, H2 thesis, H3 What/Where/Who/How, H2 sections. Legal pages have clean question-style H2s.
- **Structured data is in place.** `ProfessionalService` + `WebSite` sitewide, `CreativeWork` + `BreadcrumbList` on cases, `CollectionPage` on /work/.
- **llms.txt** summarises services and cases in plain, quotable sentences.
- **Image alts are good.** Content images have descriptive alts. Decorative images use `alt=""`. No image is missing its alt attribute.
- **Readability fits a B2B audience.** Flesch-Kincaid grade 8 to 12, Flesch reading ease 40 to 63. Sentences average 15 to 21 words, except the home page at 23.
- **Service copy** on the home page gives self-contained definitions ("Brand architecture is the organization of the portfolio...") that AI answers can quote.
- **Legal pages** show real data-controller identity, Ley 1581 and GDPR framing, and an "Updated October 29, 2026" date.

## Findings

### Critical

**C1. The team section is the same person repeated five times as placeholder roles**
- Evidence: the home HTML shows "Juliana Cabrera" with Strategy, Design, Research, Copy and Direction. All five cards carry the same quote, "The most powerful brand is not imagined. It is built, decision by decision.", and the alts read "Portrait of Juliana Cabrera, Strategy / Design / Research / Copy / Direction". The source is `lib/home-content.ts` lines 117-124. The "Meet the team" CTA points to it.
- Impact: this is the single biggest trust signal on the site, and it reads as fabricated or unfinished to buyers and quality raters. It also gives the only named expert no real bio.
- Fix: replace it with real people, or collapse it to one founder card: "Juliana Cabrera Bonilla - Founder and Strategy Director", 2 to 3 lines of real background (years in branding, past agencies or sectors, education), a LinkedIn link, and one quote. If collaborators exist, list them with their real names and roles. Until then, remove the four duplicate cards and relabel the CTA "Meet the founder". Add a `Person` node (`founder` of the Organization) with `sameAs` to LinkedIn.

### High

**H1. Headings lose word spaces in the raw HTML (H1s and several H2s)**
- Evidence: words are separate `inline-block` spans spaced with CSS `margin-right` and no whitespace text node between them. The extracted text reads "Creatingtoshapetheworld." (home H1), "Averbdoesnotdescribe.Itacts." (About H2), "Ourselectedprojects", and "Research andbenchmark", "Brandarchitecture" and the other service H3s. Case titles break at the line join: "The dawn of a newway of living", "A name that knowswhere it belongs", "Making calma brand", "A trajectory like yoursdeserves a brand equal to it." (footer H2 on every page). The home H1 has `aria-label="Creating to shape the world."`, which helps screen readers but not text extraction.
- Impact: non-rendering crawlers and AI fetchers (most LLM crawlers, Bing's text extraction, link previews) index nonsense tokens for the most important headings. Google usually renders, but its text tokenisation is not guaranteed across inline-block spans.
- Fix: in `hero-intro.tsx`, `about-section.tsx`, the services card title, the case title split and the close-section title, emit a real space between word spans: `{" "}` after each word span, or a trailing `&nbsp;` the way the case-title words already do inside lines. Also add a space where one line span ends and the next begins. Keep the visual margin, or swap it for the space.

**H2. The home H1 contains the CTA link text**
- Evidence: the `<a id="discovery" href="mailto:...">Schedule a free discovery session</a>` sits inside the `<h1>`, so the H1 text is "Creating to shape the world. Schedule a free discovery session".
- Impact: this dilutes the primary heading and puts a mailto link in the H1. The H1 also has no topical term (branding, Bogotá).
- Fix: move the anchor out of the `<h1>` and position it visually with the same CSS. Consider a visually subtle topical H1 element, or let the lead paragraph carry "boutique strategic branding consultancy in Bogotá" right under it (it already does). Do not change the visual design.

**H3. There are no service pages, so the main commercial and SXO queries have no matching page type (see the SXO section)**
- Evidence: the 7 services exist only as H3 cards on the home page (rendered twice) and as `/work/?service=` filter states. There is no URL for naming, brand strategy, rebranding or web design.
- Fix: add `/services/<slug>/` pages (start with Naming and identity, Strategic north / brand strategy, and Rebranding). Use 800+ words each with process steps, deliverables, timeline, the relevant case studies linked with names created, an FAQ, and a CTA. Feed them from the Sanity `service` type, which already exists. Add `Service` schema with `provider` set to the Organization.

**H4. No outcome proof, testimonials or dates on case studies**
- Evidence: no case has a client quote, although `docs/case-study-template.md` defines a "Founder quote" slot. No case has a year, an engagement length or a measurable result. A grep found no "%" and no year in any case body. The "transformation" tables are before/after positioning statements, not outcomes.
- Impact: Experience and Trust stay capped. QRG raters look for evidence that the work worked. Without dates, freshness is unreadable.
- Fix: per case, add the year and duration ("2025, 4 months"), one client quote with name and title, and 1 to 3 verifiable outcomes (launch, units sold, markets entered, sales-room traffic, social growth). Add `dateCreated` and `sourceOrganization` or `about` (client Organization) to the `CreativeWork` JSON-LD.

**H5. No external authority signals**
- Evidence: there are no links to Instagram, LinkedIn, Behance or Clutch anywhere. The Organization schema has no `sameAs`. There are no awards, press or client logos.
- Fix: add the real profiles to the footer and `sameAs`. Create and link Clutch, Sortlist or DesignRush and Google Business Profile listings (these are what rank for "agency + city"). Add any awards or press mentions to the About section.

### Medium

**M1. The home page duplicates the projects and services blocks in the DOM**
- Evidence: "Our selected projects" is an H2 twice, and the 8 project H3s and 7 service H3s each appear twice (desktop `.work-track` plus mobile `.work-reading` / `.services-handoff-reading`). The About paragraphs also extract twice. The result is 2,217 words, of which about 1,100 are unique.
- Impact: duplicated headings muddle the outline and halve the share of unique content. It is not a penalty risk, but it is noise for AI extraction.
- Fix: keep one copy semantic and mark the other `aria-hidden` with headings demoted to `<p>`/`<div>`, or render one version based on the media query on the client. At minimum, avoid duplicate `<h2>`/`<h3>` elements.

**M2. Case-study titles and the /work/ title carry no search intent**
- Evidence: "Albora, case study - Verbo" (26 chars), "Work - Verbo" (12 chars). None mention the discipline or the sector.
- Fix: use the pattern `<Client>: <sector> naming and brand identity, <city> - Verbo`. Examples: "Albora: residential real estate naming and branding, Bogotá - Verbo" and "Berry House: rebranding for a berry e-commerce in 4 countries - Verbo". For /work/: "Branding case studies: naming, identity and strategy - Verbo". Keep the descriptions as they are, they are good. You could add the deliverable to them ("Naming, identity and brand book for...").

**M3. The /work/ index is thin and its filter cannot separate projects**
- Evidence: 367 words, and every blurb is identical to the home page cards. The filter counts are "Strategic north 8, Naming and identity 8, Brand book 8, Website design 4", so 3 of 4 filters return everything. Research and benchmark, Brand architecture and Strategic accompaniment are services with no tagged projects.
- Fix: add a 100 to 150 word intro (what Verbo does, sectors, countries), filters by sector (real estate, food, travel, automotive, territory), and links to the service pages. Tag projects honestly with the research, architecture and accompaniment services where they applied.

**M4. The service taxonomy is inconsistent between case pages and the filter**
- Evidence: Berry House "What we did" lists Strategy, Identity, Brand book, Website (no Naming, which fits since it is a rebrand of an existing name), but it is tagged "Naming and identity" on /work/ and home. Case chips say "Strategy / Naming / Identity" while the filter says "Strategic north / Naming and identity".
- Fix: use one vocabulary, the Sanity `service` titles. Render the "What we did" chips from the same references and link each chip to `/work/?service=<slug>` (later `/services/<slug>/`).

**M5. Case studies follow a rigid template, with recurring stock phrasing**
- Evidence: all 8 cases use the same skeleton (What changed, Built from X, Where/Who/How, X's transformation, Making X Y, Where X lives). Recurring lines include "The brand book gave ... one system" (4 cases) and "closed the loop" (3 cases). The H3 personas follow one formula ("The conscious family", "The conscious inhabitant", "The place-seeker", "The pleasure-seeker").
- Impact: the text is unique, but this "repetitive structure across pages" is the pattern the QRG associates with scaled content. It reads polished but generic.
- Fix: keep the layout but vary the language. Give each case one section that only it could have: a naming shortlist with the rejected names, a research insight with a source, a sketch-to-final step. Rewrite the repeated brand-book sentences.

**M6. The site is English-only while the local market searches in Spanish**
- Evidence: `lang="en"` with no `hreflang` and no Spanish URLs. Core local queries ("agencia de branding Bogotá", "agencia de naming", "consultoría de marca") are Spanish.
- Fix: if Colombian clients are a target (the privacy policy cites Ley 1581, so they likely are), plan an `/es/` version, starting with home, services and 3 cases, with `hreflang` pairs. If the English-only choice is deliberate (export clients), say so in the positioning copy ("for brands in Colombia and abroad") and accept that the Spanish SERPs are out of reach.

**M7. Trust and contact basics are thin on the main pages**
- Evidence: contact is a mailto plus a WhatsApp float (7 identical `wa.me` links on the home page). There is no contact page, no city address, no phone in visible copy (it is only in /privacy/) and no `telephone` in the schema. The "about" copy is vague ("Verbo Brands grew out of years of building brands for others"), with no year founded and no number of projects.
- Fix: add the phone and "Bogotá, Colombia" to the footer, and `telephone` to `ProfessionalService`. State the founding year and experience ("12 years, 40+ brands"; use real figures only). A short `/contact/` page with what happens after the first email would help both trust and SXO.

### Low

**L1. Loader and counter strings in the HTML.** "Loading case study" appears in the static HTML of every case, and "00" appears in the home hero. Mark them `aria-hidden` and keep them out of text extraction, or render the text through CSS `content`.

**L2. Sitemap lastmod is identical for all content URLs.** All 10 URLs show `2026-10-24T04:22:56Z` (a build or bulk-import timestamp), and /privacy/ and /terms/ have no lastmod even though they show "Updated October 29, 2026". Use each document's real `_updatedAt`, and the legal date for the legal pages. Identical lastmods teach Google to ignore the field.

**L3. Home readability.** The average sentence is 23 words and some headline claims are abstract ("create worlds where people find their place"). Tighten 2 to 3 sentences in the belief block. This is a copy choice, so it is optional.

**L4. Home image links have no anchor text.** Each case is linked twice from the home page: an image link with an empty anchor and a name link. "View" is also used as text 8 times. Give image links `aria-label="<Client> case study"`, or make one card-level link.

**L5. /work/ has no footer** (no privacy or terms links, unlike the other pages). Add the shared footer for consistent internal linking.

### Info

- Readability (Flesch reading ease / FK grade): Altos 40/12.0, Lukatto 57/9.7, Altalba 51/11.4, Berry 48/11.5, Albora 49/11.6, Lienzo 47/11.4, Autip 63/8.1, Cruise 51/10.1, Home 49/12.2, Privacy 53/10.6, Terms 61/9.1.
- No blog. That is acceptable for a boutique studio, but it means there is no page for informational queries ("how to name a brand", "what is brand architecture", "cost of branding in Colombia"). A handful of evergreen guides built from the service definitions would serve both SXO and AI citation.
- Word counts: case studies (about 560-610 unique words) are adequate for portfolio pages, and coverage depth matters more than length. Home body coverage is fine. The thin spots are /work/ and the absent service pages.
- AI-content assessment: the copy has a distinct voice and specific details. It does not read as low-quality AI text. The QRG risks are the repeated structure (M5) and the missing first-hand evidence (H4), not generic wording.

## Internal linking summary

- Home links to all 8 cases (twice each) and to /work/, /privacy/ and /terms/. Its anchor links (#belief, #services, #contact) are fine.
- Each case links to the other 7 through "More work", with descriptive anchors (name + tagline), and to the home section anchors. Cases do not link to /work/ filters, and there are no service pages to link to.
- No page links to a service URL (none exist). Fixing H3 and M4 closes the biggest internal-linking gap: services to cases, and cases to services.

## AI citation readiness (55/100)

Positives: llms.txt, Organization JSON-LD, self-contained service definitions, clean H2 legal pages, real figures in some cases.
Gaps: headings without spaces in raw HTML (H1), no quotable firm facts (founded, team size, project count, sectors, countries served, typical engagement and timeline, price range), no FAQ blocks, no dated case facts, no named expert, no `sameAs`.
Fix: add an "At a glance" fact block to the home or About section (founded, based in Bogotá, number of brands, sectors, countries, services), FAQs on the service pages, and a year and result line per case.

## SXO view (query to page-type match)

Note: live SERPs were not fetched. The page types below are the patterns these queries typically return, so verify them in an incognito Colombia-located search before you prioritise.

| Query | What typically ranks | Verbo's matching page | Gap |
| --- | --- | --- | --- |
| branding agency Bogotá | Local pack (Google Business Profile), directory listicles (Clutch, Sortlist, DesignRush, GoodFirms "Top branding agencies in Bogotá"), agency homepages | Home: the title "Strategic branding consultancy in Bogotá" matches well | No GBP, no directory profiles, no reviews. The H1 lacks topical terms (H2 above). |
| agencia de branding Bogotá (Spanish equivalent) | Same, in Spanish | None (English only) | M6 |
| branding consultancy Colombia | Agency homepages and About pages, directories | Home (says Bogotá, Colombia appears only in case blurbs) | Add "Colombia" and the countries served to the home copy and an About fact block |
| naming agency Bogotá / agencia de naming | Dedicated naming service pages with process, name examples and FAQs. Some listicles. | None. Naming is an H3 card on home. | Strongest content opportunity: Verbo created names (Albora, Altalba del Camino, Lienzo, Autip, Lukatto). Build `/services/naming/` with the story behind each name. |
| brand strategy consultant Bogotá | Service pages, consultant profiles (LinkedIn), agency pages | None | `/services/brand-strategy/` (Strategic north), plus a founder profile |
| rebranding agency Colombia | Service pages plus case studies | Berry House case only | A rebranding service page linking to Berry House |
| real estate branding Colombia / branding inmobiliario | Niche agency pages and case studies | 4 real-estate or territory cases (Albora, Altalba, Altos, Cruise On Land) | A sector page "Real estate branding" that gathers those 4 cases. This vertical is Verbo's clearest specialisation. |

## Structured findings (for audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "content_score": 52,
  "onpage_score": 63,
  "eeat": {"experience": 60, "expertise": 40, "authoritativeness": 25, "trustworthiness": 50, "weighted": 43},
  "ai_citation_readiness": 55,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "C1", "severity": "Critical", "title": "Team section repeats Juliana Cabrera five times as placeholder roles", "url": "https://verbobrands.com/#team", "source": "lib/home-content.ts:117-124"},
    {"id": "H1", "severity": "High", "title": "Heading word spans have no whitespace; raw text reads 'Creatingtoshapetheworld.'", "url": "sitewide"},
    {"id": "H2", "severity": "High", "title": "Home H1 contains the mailto CTA link", "url": "https://verbobrands.com/"},
    {"id": "H3", "severity": "High", "title": "No service pages for naming, strategy or rebranding queries", "url": "sitewide"},
    {"id": "H4", "severity": "High", "title": "Case studies lack dates, client quotes and outcomes", "url": "/work/*"},
    {"id": "H5", "severity": "High", "title": "No sameAs, social, directory, awards or press signals", "url": "sitewide"},
    {"id": "M1", "severity": "Medium", "title": "Home duplicates projects and services blocks (duplicate H2/H3s)", "url": "https://verbobrands.com/"},
    {"id": "M2", "severity": "Medium", "title": "Case and /work/ titles carry no intent terms", "url": "/work/*"},
    {"id": "M3", "severity": "Medium", "title": "/work/ is thin and 3 of 4 filters match all 8 projects", "url": "https://verbobrands.com/work/"},
    {"id": "M4", "severity": "Medium", "title": "Service taxonomy differs between case chips and filters", "url": "/work/*"},
    {"id": "M5", "severity": "Medium", "title": "Rigid case template with recurring stock phrasing", "url": "/work/*"},
    {"id": "M6", "severity": "Medium", "title": "English-only site vs Spanish local queries", "url": "sitewide"},
    {"id": "M7", "severity": "Medium", "title": "Thin contact and firm facts (no address, phone or founding year in copy)", "url": "sitewide"},
    {"id": "L1", "severity": "Low", "title": "'Loading case study' and '00' strings in static HTML", "url": "sitewide"},
    {"id": "L2", "severity": "Low", "title": "Identical sitemap lastmod; legal pages have none", "url": "/sitemap.xml"},
    {"id": "L3", "severity": "Low", "title": "Home sentences average 23 words", "url": "https://verbobrands.com/"},
    {"id": "L4", "severity": "Low", "title": "Image links without anchor text; 8 'View' anchors", "url": "https://verbobrands.com/"},
    {"id": "L5", "severity": "Low", "title": "/work/ has no footer links", "url": "https://verbobrands.com/work/"}
  ]
}
```
