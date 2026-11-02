# Schema / Structured Data audit - https://verbobrands.com

Audited 2026-10-29 via curl on /, /work/, /work/lukatto/, /work/albora/. Generator: lib/seo.ts (read only).

## Score: 78 / 100

## Detection
| Page | Blocks | Contents |
| --- | --- | --- |
| / | 1 | @graph: ProfessionalService (#organization) + WebSite (#website) |
| /work/ | 2 | root graph + @graph: CollectionPage, BreadcrumbList (2 items) |
| /work/lukatto/ | 2 | root graph + @graph: CreativeWork, BreadcrumbList (3 items) |
| /work/albora/ | 2 | same pattern as lukatto |

All server-rendered in raw HTML. JSON-LD only, no Microdata or RDFa. Non-ASCII ("Bogotá") is valid UTF-8 (verified by bytes c3 a1).

## What works
- All blocks parse as valid JSON. @context is https://schema.org. No placeholders, no deprecated types (no FAQPage, HowTo).
- All URLs are absolute and use the trailing-slash form that matches the canonical URLs.
- @id linking resolves: WebSite.publisher -> #organization, CollectionPage.isPartOf -> #website, CreativeWork.creator -> #organization. All targets exist in the root graph on the same page.
- BreadcrumbList is valid for Google (position, name, item on every entry).
- Organization identity is consistent (name, url, logo 512px square PNG, image, email, PostalAddress).
- ISO 8601 dateModified. Images are absolute.

## Findings

### 1. MEDIUM - ProfessionalService with no street address or phone is only partly complete for LocalBusiness
Evidence: ProfessionalService is a LocalBusiness subtype. Google's local business guidance wants address (ideally streetAddress, postalCode) and telephone. The block has only addressLocality and addressCountry, and no telephone although one exists.
Type judgement: ProfessionalService is acceptable for a consultancy, but only if Verbo wants a local-entity signal. For a remote or by-appointment studio with no public street address, plain Organization is the safer choice. Neither type produces a rich result, so this is entity clarity only.
Fix: add telephone and areaServed (snippet A). Keep ProfessionalService, or use Organization if you will never publish a street address. Do not add openingHours or priceRange without real values.

### 2. MEDIUM - Case-study CreativeWork is thin and not tied to a page entity
Evidence: CreativeWork has no @id, no mainEntityOfPage/isPartOf, no dateCreated/datePublished, no client/about. dateModified is identical on lukatto and albora (2026-10-24T04:22:56Z), which suggests a dataset-wide timestamp, not a per-project _updatedAt. Google does not use CreativeWork for rich results, so the value is semantic and AI-search clarity only.
Fix: add @id, isPartOf -> #website, mainEntityOfPage, dateCreated or datePublished (project year), and about for the client brand (snippet C). Confirm updatedAt is the project's own _updatedAt.

### 3. LOW - No founder / people entity
Evidence: no founder, employee or Person. The email is juliana@verbobrands.com, so a named founder probably exists.
Fix: add a Person with @id and link via founder (snippet B). Use real data only.

### 4. LOW - Root graph repeated in full on every page
Valid, since identical @id nodes merge, and it is the usual pattern. Payload cost is minor. No fix required.

### 5. LOW - Missing alternateName; CollectionPage has no @id or mainEntity
Fix: add alternateName (for example "Verbo Brands") on org and WebSite. Give CollectionPage an @id and an ItemList of case URLs (snippet D). Optional.

### 6. LOW - sameAs deliberately omitted (owner decision)
Not an error. It is the largest remaining entity-disambiguation gap, because "Verbo" is a common word. Revisit once LinkedIn or Instagram profiles exist.

### 7. INFO - WebSite has no potentialAction
Correct to omit. Google retired the sitelinks search box and the site has no search.

### 8. INFO - inLanguage "en" for a Colombian business
Fine if the site is English only. Add Spanish only if es pages are added (with hreflang).

## Rich-result eligibility
- BreadcrumbList: eligible and valid on /work/ and the case pages.
- Organization logo: meets the minimum size and is square.
- Nothing else here has a Google rich result. No Review/AggregateRating is present, which is correct unless real visible reviews exist.

## Recommended JSON-LD

### A. Organization additions (add to the ProfessionalService node in lib/seo.ts)
```json
{
  "@type": "ProfessionalService",
  "@id": "https://verbobrands.com/#organization",
  "alternateName": "Verbo Brands",
  "telephone": "+57-318-346-0278",
  "areaServed": [
    { "@type": "Country", "name": "Colombia" },
    { "@type": "Place", "name": "Latin America" }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+57-318-346-0278",
    "email": "juliana@verbobrands.com",
    "availableLanguage": ["en", "es"]
  }
}
```
Keep areaServed to places Verbo really serves.

### B. Founder (fill in the real name and title)
```json
{
  "@type": "Person",
  "@id": "https://verbobrands.com/#founder",
  "name": "<Real name>",
  "jobTitle": "<Real title>",
  "worksFor": { "@id": "https://verbobrands.com/#organization" }
}
```
Then add `"founder": { "@id": "https://verbobrands.com/#founder" }` to the organization node.

### C. Case study CreativeWork (replace the node in jsonLdCaseStudy)
```json
{
  "@type": "CreativeWork",
  "@id": "https://verbobrands.com/work/lukatto/#project",
  "name": "Lukatto",
  "headline": "Lukatto, case study",
  "description": "A premium ice cream and fruit brand with a bold identity and a voice that makes freshness feel luxurious.",
  "url": "https://verbobrands.com/work/lukatto/",
  "mainEntityOfPage": "https://verbobrands.com/work/lukatto/",
  "isPartOf": { "@id": "https://verbobrands.com/#website" },
  "image": "https://cdn.sanity.io/images/3bttmpaw/production/e61a7a3fcd5a0426adc833bd5a73dd982932c15b-2008x1114.jpg",
  "inLanguage": "en",
  "creator": { "@id": "https://verbobrands.com/#organization" },
  "about": { "@type": "Brand", "name": "Lukatto" },
  "genre": ["Strategy", "Naming", "Identity", "Brand book"],
  "dateCreated": "<project year, ISO 8601>",
  "dateModified": "<project _updatedAt, ISO 8601>"
}
```
dateCreated needs real project data (for example a year field added to the Sanity project type). Do not invent it.

### D. CollectionPage upgrade for /work/
```json
{
  "@type": "CollectionPage",
  "@id": "https://verbobrands.com/work/#webpage",
  "name": "Work",
  "url": "https://verbobrands.com/work/",
  "isPartOf": { "@id": "https://verbobrands.com/#website" },
  "about": { "@id": "https://verbobrands.com/#organization" },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://verbobrands.com/work/lukatto/", "name": "Lukatto" },
      { "@type": "ListItem", "position": 2, "url": "https://verbobrands.com/work/albora/", "name": "Albora" }
    ]
  }
}
```
Generate the list from the projects export so it stays in sync with Sanity.

## Score breakdown
Validity and syntax 25/25. @id linking 18/20. Google required properties and rules 18/20. Completeness (telephone, founder, areaServed, dates, client) 12/25. Type choice 5/10.
