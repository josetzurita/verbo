# Action plan - verbobrands.com (score 65)

Tagged by who can do it: **[code]** means I can do it in the repo, **[you]** needs you or the team, **[decide]** needs a choice first.

## Critical (this week)
- [ ] **[you + code]** Replace the placeholder team: either the real team, or one founder card for Juliana Cabrera Bonilla (role, 2-3 line bio, photo). Then add a founder `Person` to the schema.

## High (within 1-2 weeks)
- [ ] **[code]** Fix heading word spaces in the split-text components (home H1, belief, work, close, case titles).
- [ ] **[code]** Move "Schedule a free discovery session" out of the home H1.
- [ ] **[code]** Add `public/_headers`:
  - `/_next/static/*` immutable for 1 year
  - images with a long max-age
  - nosniff, frame protection, Referrer-Policy, Permissions-Policy
- [ ] **[code]** Speed up the intro loader: smaller Sanity sizes, preload one image, wait only for the first frame.
- [ ] **[code]** Convert `about/portrait.png` and `belief/*.png` to WebP, and drop the below-the-fold preloads.
- [ ] **[you]** Create a Google Business Profile, a LinkedIn company page and a Behance profile. Add Clutch or Sortlist if you want. Send me the URLs and I'll add them as `sameAs`.
- [ ] **[you + code]** Add to each case: year, client, country, scope, and one client quote or result if you have it. I'd add a `year` field in Sanity.

## Medium (within a month)
- [ ] **[code]** Fix `/styleguide/` so production returns a real 404, and put a single robots tag on the 404 page.
- [ ] **[code]** Add search terms to the case and `/work/` titles. Make case H1s include the project name.
- [ ] **[code]** Schema: add telephone, `areaServed`, `contactPoint` and `alternateName` "Verbo Brands". Add `@id`, `mainEntityOfPage` and `dateCreated` to case pages.
- [ ] **[code]** Fix the CTA links that are hidden from agents until scrolled (animate opacity only).
- [ ] **[code]** Cap the close-section plate image widths at about 480px.
- [ ] **[decide]** AI training: block training crawlers in robots.txt and add `Content-Signal: ai-train=no` to match the terms, or loosen the terms.
- [ ] **[decide]** Cloudflare Web Analytics: keep it and add one line to the privacy policy, or turn it off since GA4 covers analytics.
- [ ] **[you + code]** Naming service page, then brand strategy and real-estate branding pages.

## Low (backlog)
- [ ] Render the home projects and services copy once instead of twice (desktop and mobile).
- [ ] Use `og:type` article on case pages, drop the robots.txt `Host:` line, add an IndexNow key.
- [ ] Make the first case image eager and high priority.
- [ ] Spanish version (already planned).

## Monitoring
- Check Search Console in about a week, under Pages and Performance.
- Run PageSpeed Insights once the site has real traffic.
- Run `/seo audit https://verbobrands.com` again after each phase, and set a drift baseline.
