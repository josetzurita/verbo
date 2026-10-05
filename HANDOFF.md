# Verbo handoff

Written 4 Oct 2026 so the site can continue on another computer. Remote: https://github.com/josetzurita/verbo (`main`).

Design source: [VERBO-WEBSITE in Figma](https://www.figma.com/design/5v0NhMTyNLxEgmaWn1Y3Em/VERBO-WEBSITE). Nodes used so far: hero `37:2`, nav mark hover `8:19`, belief section `45:25`.

## What this is

Verbo is a branding-agency portfolio. The production page is one dark poster: field `#39170d`, type `#faf5ee`, Figtree Light (weight 300). It was scaffolded from the CDS client-site starter (`templates/client-site` in [starter-website](https://github.com/josetzurita/starter-website)). It is Next.js App Router, Tailwind v4, semantic tokens, GSAP for the home motion, Motion `Reveal` on the work list, and one Lenis instance.

`AGENTS.md` is the constraint list. Keep it: TypeScript strict with `noUncheckedIndexedAccess`, Server Components by default, `ProjectProviders` as the only client root, animate only transform and opacity, one Lenis instance only when `motion.smoothScroll` is true, route transitions `none` or `overlay`, semantic tokens only (no Inter, no Lucide, no `#000000` / `#ffffff`), visible copy uses hyphens, identity comes from `project.config.ts`, `/styleguide` stays out of public nav.

## Run

Node 20+ and pnpm 10. The lockfile is `pnpm-lock.yaml`. A stray `package-lock.json` was left untracked on purpose.

```bash
pnpm install
pnpm dev
```

Dev server: http://127.0.0.1:4317 (`0.0.0.0:4317`).

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Page, top to bottom

`app/layout.tsx` mounts `HomeNav` and the page children. `app/page.tsx` is three blocks:

1. `#top` hero (`components/hero-intro.tsx`)
2. `#belief` (`components/belief-section.tsx`)
3. `#work` indexed case list, paper surface (`.theme-paper`)

`/work` only redirects to `/#work`. There are no case pages.

Copy lives in `lib/home-content.ts`. SVG path data for the wordmark and the nav mark lives in `lib/brand-paths.ts`.

### Hero

Headline is two lines: "Creating to" / "shape the world." Words mask-reveal on load (`yPercent`, `power3.out`). The outlined VERBO wordmark is six separate letter paths that rise in after the headline (`hero-intro.tsx`, aspect `1632 / 404.901`).

"Schedule a free discovery session" sits on the second line and is a `mailto:hola@verbobrands.co` link (`#discovery`). It is an `UnderlineLink` with `entrance="mount"`. Hovering it draws the image trail.

### Nav

`components/home-nav.tsx` is fixed, three columns: Menu, center mark, Why us? / Services / Contact (the side links show from `lg`).

- Hides on scroll down, returns on scroll up, stays visible near the top and while the menu is open.
- When `#work` reaches the top, `header[data-surface="paper"]` flips the header to the paper tokens so type stays readable on the light work block.
- Menu is a Radix dialog. Services opens the same dialog and scrolls to the services list. Service copy is the Spanish list in `home-content.ts`.
- Center mark (`components/nav-mark.tsx`, `data-coordinate-mark`) is the ring-and-pupil logo. The pupil tracks the pointer. Hover plays the Figma morph: the pupil travels, a clip opens, and the wordmark draws across the mark. Timing samples are scaled from a 1728×1117 Figma frame (`MARK_SCALE`, `DOT_X` / `DOT_Y`).

### Coordinate cursor

`components/coordinate-cursor.tsx` replaces the system cursor on fine pointers. It draws a crosshair, a square, and Source Serif coordinates. Over the nav mark the lines collapse and the square scales up. Over a trail link the coordinates hide and the image trail takes over. Reduced motion and coarse pointers leave the native cursor.

### Belief

Sticky, one viewport tall, type aligned to the bottom. An `80dvh` spacer after it lets `#work` cover the sticky block.

Headline (six lines): "Branding isn’t art. / It’s the most / important business / decision a / company can / make." Each word starts at opacity `0.24` and scrubs to `1` (`ScrollTrigger` on the `h2`, stagger `0.08`). Reduced motion sets the words to `1`.

Beside "It’s the most" a three-frame image loop plays (`public/belief/sequence-1.png` through `sequence-3.png`). Hold time is `FRAME_HOLD_MS` (700). Crops are `FRAME_PLACEMENTS`. The loop does not affect the word fade.

The right column is four paragraphs plus "Get to know us" (`#work`). Paragraphs rise in (`yPercent` 120 to 0) when the column enters. The link’s trail paints under the copy: `trailUnder`, aim left / level, spread `1.35`, inset `40`, count `6`.

Desktop type size is the `--belief-size` clamp in the `h2` style. It is fit to the viewport and to the 344px column.

### Work list

Six cases in `cases`. Each row is an index, tag, name, description, services, and an image. Images are expected at `/work/lienzo.jpg`, `altos.jpg`, `borolo.jpg`, `bside.jpg`, `exponencial.jpg`, `cenicana.jpg`. Those files are not in `public/` yet, so `ResponsiveImage` shows the name as a fallback. The section uses `.theme-paper` (cream field, brown type).

### Underline and trail

`components/underline-link.tsx` draws the rule and reveals the label. `entrance` is `"mount"` or `"view"`. Trail props set `data-cursor-trail*` attributes.

`components/cursor-trail.ts` owns the trail. Frames are `public/cursor-trail/face.png`, `facade.png`, `window.png`, `vessel.png`, stroked with `--trail-amber`, `--foreground`, `--trail-blue`, `--trail-yellow`. Up to 8 frames, spawn every 140ms, fan offsets match the Figma layout. Default aim is right / top.

Trail colors are tokens in `app/tokens.css`: `--trail-amber` `#faab2a`, `--trail-blue` `#2d83ea`, `--trail-yellow` `#fefd04`.

## Already on main before this handoff

- `076d4a3` Initialize project.
- `cc1cbb1` Scaffold the home from the client-site starter.
- `7a790f8` Align the hero wordmark and make the nav scroll-aware.
- `a507a0d` Sit the discovery link beside the headline and follow the pointer with coordinates.

This commit adds the belief section, the extracted hero intro, the nav-mark hover, the cursor trail, the underline link, brand paths, paper-surface tokens, the belief and trail images, and this file.

## Still open

- Case images are missing from `public/work/`.
- No case study routes. `/work` redirects home.
- `project.config.ts` `canonicalUrl` is still `http://127.0.0.1:4317`.
- Discovery is a mailto, not a form or booking flow.
- `pointerAccent.enabled` is false. The coordinate cursor is the pointer treatment.
- Page transition is `none`.
- The home stops at the work list. Later Figma sections are not built.
- `/styleguide` is a dev specimen. Production 404s unless `ENABLE_STYLEGUIDE=true`.

## Where to edit

| Change | File |
| --- | --- |
| Copy, cases, services | `lib/home-content.ts` |
| Logo and mark paths | `lib/brand-paths.ts` |
| Hero motion and layout | `components/hero-intro.tsx` |
| Belief layout, word fade, image loop | `components/belief-section.tsx` |
| Nav, menu, paper surface | `components/home-nav.tsx` |
| Mark hover | `components/nav-mark.tsx` |
| Crosshair cursor | `components/coordinate-cursor.tsx` |
| Image trail | `components/cursor-trail.ts` |
| Underline links | `components/underline-link.tsx` |
| Colors | `app/tokens.css` |
| Site name, locale, motion flags | `project.config.ts` |
