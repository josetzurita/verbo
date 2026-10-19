# Verbo handoff

Updated 18 Oct 2026. Remote: https://github.com/josetzurita/verbo (`main`).

The codebase map, rules and commands are in `AGENTS.md`. This file covers status, history and open work.

Design source: [VERBO-WEBSITE in Figma](https://www.figma.com/design/5v0NhMTyNLxEgmaWn1Y3Em/VERBO-WEBSITE). Nodes used: hero `37:2`, nav mark hover `8:19`, belief section `45:25`.

## Status

The home page is built end to end: hero, belief, projects stack with the services handoff, about and team, and the close footer. One case study page is live (`/work/lienzo`). Its content rules are in `case-study-template.md`.

All content is placeholder in `lib/home-content.ts` and `lib/case-study.ts` until the database exists. Team cards repeat one portrait and one quote.

## History

| Commit | What changed |
| --- | --- |
| `076d4a3`, `cc1cbb1` | Project scaffolded from the CDS client-site starter |
| `7a790f8`, `a507a0d` | Hero wordmark, scroll-aware nav, discovery link, coordinate cursor |
| `28fbbe2` | Belief section, cursor trail, nav mark hover, underline link |
| `802bdd8` | Lenis `lerp` 0.1 -> 0.25, belief spacer `80dvh` -> `40dvh` |
| `28cff12` | The work list became the pinned 3D card stack plus the services handoff |
| `b7cb2fa` | Case study route, about, team, close footer, route overlay |
| `bb02d82` | Thinner floating plates over the footer type |
| `3a1d4c4` | Short-desktop media block, so a 14" screen keeps the 32" composition |
| (this) | Laptop scroll pass: free card scroll with a soft settle instead of the one-card-per-gesture lock with a 700ms wait. `STEP` 0.9 -> 0.6, `HANDOFF_VIEWPORTS` 8 -> 4, service cards 1.2s -> 0.9s. The pinned stretch went from about 12.5 to about 7 screens. Card links follow keyboard focus, and the hidden reading list left the tab order. |

## Still open

- Database to replace the `lib/` content.
- Only one case study (`lienzo`). The other five cases have no `href` yet.
- Team section: real people, portraits and quotes.
- `project.config.ts` `canonicalUrl` is still `http://127.0.0.1:4317`.
- Discovery and contact are `mailto:` links, not a form or booking flow.
- `pointerAccent.enabled` is false. The coordinate cursor is the pointer treatment.
- Scroll feel on a real trackpad should be rechecked after any motion change. Browser emulation does not reproduce trackpad momentum.
- `/styleguide` is a dev specimen. Production returns 404 unless `ENABLE_STYLEGUIDE=true`.
