# AGENTS

Verbo, a branding-agency portfolio. One theme for the whole page: field `#39170d`, type `#faf5ee`, Figtree Light. Scaffolded from the CDS client-site starter. Keep the production shell constraints.

Read this file first. It is meant to replace a full codebase read. Open a file only when the task touches it.

## Rules

- TypeScript strict mode. `noUncheckedIndexedAccess` is on.
- Server Components by default. `ProjectProviders` is the only client root boundary.
- Animate only transform and opacity.
- Exactly one Lenis instance, created only when `motion.smoothScroll` is true.
- Route transitions are `none` or `overlay`. Overlay visuals live in `app/route-overlay.tsx`.
- Semantic tokens only. No Inter, no Lucide, no `#000000` / `#ffffff`.
- Body copy (running paragraphs) uses `text-copy`. How dim it is lives in `--copy-mix` in `app/tokens.css`; change it there, never per component. Headings, links and small labels stay at full foreground.
- Visible copy uses hyphens, not em dashes.
- Production identity comes from `project.config.ts`. Do not invent missing values.
- `/styleguide` is a development specimen. Keep it out of public navigation. It is noindexed. Production returns 404 unless `ENABLE_STYLEGUIDE=true`.
- Customize the styleguide by editing `app/tokens.css`, `project.config.ts`, and `app/styleguide/_data/styleguide-data.ts`. Do not duplicate color hex values in specimen files.

## Working style

- The design is set in Figma ([VERBO-WEBSITE](https://www.figma.com/design/5v0NhMTyNLxEgmaWn1Y3Em/VERBO-WEBSITE)). Adjust and fix. Do not redesign or restyle unless asked.
- The owner designs on a 32" screen. Every layout or motion change must also work on a MacBook 14" (1512x982). Check both.
- Prefer free scroll. No gesture locks, no forced scroll jumps, no long pins. Soft settles are fine if any input cancels them.
- Content in `lib/` is placeholder. A database replaces it later, so keep components reading from those exports, not from hardcoded copy.

## Commands

Use npm; `package-lock.json` is the lockfile.

```bash
npm run dev        # http://localhost:4317 (EADDRINUSE = a dev server is already running)
npm run typecheck
npm run lint
npm run build
```

## Map

Stack: Next.js 15 App Router, React 19, Tailwind v4, GSAP + ScrollTrigger (+ CustomEase), Lenis, Motion (reduced-motion hook only).

`app/layout.tsx` mounts `Providers` -> `SkipLink`, `CoordinateCursor`, `HomeNav`, `MainContent`.

### Home (`app/page.tsx`), top to bottom

| Section | Component | Motion |
| --- | --- | --- |
| `#top` hero | `components/hero-intro.tsx` | Load timeline: word masks, wordmark letters, slogan chars |
| `#belief` | `components/belief-section.tsx` | `sticky top-0`, one screen, then a `40dvh` spacer so Work covers it. The word fade scrubs `top 90%` -> `bottom 95%`. It only scrubs while the section moves, so do not end it later than where the section sticks. |
| `#work` projects + services | `components/work-stage.tsx`, `components/services-handoff.tsx` | One ScrollTrigger pins `.work-track`. Cards: `STEP` (0.6 viewport) per card, progress follows scroll through `gsap.quickTo`, and the scroll settles on the nearest card after 140ms of quiet. Then `HANDOFF_VIEWPORTS` (4) of "Our expertise": veil, title words, pan, and service cards that stack at progress `0.28 + i * gap`. Below 768px or with reduced motion, `.work-reading` and `.services-handoff-reading` render instead. |
| `#about` + `#team` | `components/about-section.tsx` | Lines are measured into rows, then rise once. Cards rise once. Portrait scales on hover. |
| `#close` footer | `components/close-section.tsx` | A fixed footer is revealed by a `100dvh` spacer. Floating plates loop, slow down on hover, and blur the others. |

### Case study (`/work/[slug]`)

- `app/work/[slug]/page.tsx` -> `components/case-study-view.tsx`, wrapped in `components/case-motion.tsx` (reveals, parallax, scrubbed rows).
- `components/case-more.tsx` is a pinned horizontal "More work" strip.
- Data comes from Sanity (`lib/projects.ts`). `lib/case-study.ts` is the fallback while the dataset is empty. The content rules are in `docs/case-study-template.md`.
- `/work` is a filterable index (`app/work/page.tsx` -> `components/work-index.tsx`). Service and deliverable chips filter client-side and mirror `?service=&deliverable=`.

### Shared pieces

| Concern | File |
| --- | --- |
| Copy, cases, services, about, close (placeholders) | `lib/home-content.ts` |
| Projects and services from Sanity | `lib/projects.ts`, `lib/services.ts` (services double as filter categories) |
| Logo and mark paths | `lib/brand-paths.ts` |
| Nav, menu dialog, paper surface flip, hide on scroll | `components/home-nav.tsx`, `components/nav-mark.tsx`. Menu copy is `menu` in `lib/home-content.ts`. Its section links target `#belief`, `#work`, `#services` (a marker the Work stage places at the first service card), `#about` and `#contact` (a marker before the footer). Arriving on `/#section` overrides the saved home scroll. |
| Crosshair cursor and image trail | `components/coordinate-cursor.tsx`, `components/cursor-trail.ts`, `components/underline-link.tsx` |
| Lenis setup and GSAP sync | `components/smooth-scroll-provider.tsx`, `smooth-scroll-options.ts` (`lerp 0.25`), `smooth-scroll-sync.ts` |
| Scroll API (`scrollTo`, `duration`, `immediate`) | `components/use-smooth-scroll.ts` |
| Home scroll restore and "back to hero" reset | `components/home-scroll.ts`, used inside `work-stage.tsx` |
| Route overlay | `components/route-transition-provider.tsx`, `app/route-overlay.tsx` |
| GSAP registration | `components/gsap.ts` (always call `registerGsap()`) |
| Tokens | `app/tokens.css` |
| Global and section CSS | `app/globals.css` |

### Short-screen rule

`app/globals.css` has a `@media (min-width: 768px) and (max-height: 1100px)` block. It scales the 32" composition down for laptops. Put laptop fixes there, so tall screens are untouched. `work-stage.tsx` reads the same query (`shortDesktop`) for the service-card stop.

## Patterns

- Every motion block uses `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` branch, plus a reduce branch that sets the end state.
- Use `useGSAP` with `{ scope: rootRef }`, and return `mm.revert()`.
- Pointer-only effects are gated on `(pointer: fine) and (hover: hover)`.
- Index access needs `?? fallback` (because of `noUncheckedIndexedAccess`).

## Sanity

- Studio: `../studio-verbo-brands` (deployed to verbo-brands.sanity.studio). Types: `project`, `service`, `deliverable`, `caseImage`.
- Projects reference services and deliverables, and those references drive the `/work` filter. Services feed the "Our expertise" cards and the menu.
- Document ids use dashes (`project-albora`). A dotted id is a private path, and the public site cannot read it.
- Case pages load images through `components/case-photo.tsx` (four widths, quality 85, Sanity `lqip` blur placeholder). After publishing new images, run `node scripts/warm-case-images.mjs` so the first visitor gets cached transforms. The homepage keeps `ResponsiveImage`.
- Import from Drive: `node scripts/fetch-drive.mjs` (downloads and optimizes to `../verbo-drive/`), then `npx sanity exec scripts/import-drive.ts --with-user-token` (add `-- --dry` to validate). Content lives in `scripts/content/*.json`.
