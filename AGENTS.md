# AGENTS

Verbo, a branding-agency portfolio. One theme for the whole page: field `#39170d`, type `#faf5ee`, Figtree Light. Scaffolded from the CDS client-site starter. Keep the production shell constraints.

- TypeScript strict mode. `noUncheckedIndexedAccess` is on.
- Server Components by default. `ProjectProviders` is the only client root boundary.
- Animate only transform and opacity.
- Exactly one Lenis instance, created only when `motion.smoothScroll` is true.
- Route transitions are `none` or `overlay`. Overlay visuals live in `app/route-overlay.tsx`.
- Semantic tokens only. No Inter, no Lucide, no `#000000` / `#ffffff`.
- Visible copy uses hyphens, not em dashes.
- Production identity comes from `project.config.ts`. Do not invent missing values.
- `/styleguide` is a development specimen. Keep it out of public navigation. It is noindexed. Production returns 404 unless `ENABLE_STYLEGUIDE=true`.
- Customize the styleguide by editing `app/tokens.css`, `project.config.ts`, and `app/styleguide/_data/styleguide-data.ts`. Do not duplicate color hex values in specimen files.
