# Verbo

Verbo is a branding-agency portfolio. The home page is one dark poster: field `#39170d`, type `#faf5ee`, Figtree Light. The hero follows the studio frame (menu, center mark, side links, two-line headline, text link, outlined wordmark). Below it, a narrow belief column and an indexed list of client work.

This app is the CDS client-site starter (`templates/client-site` from [starter-website](https://github.com/josetzurita/starter-website)): Next.js App Router, Tailwind v4, semantic tokens, and the kit motion shell (Motion `Reveal`, one Lenis smooth-scroll instance, reduced motion). It is not a blank Next app.

## Run

Node 20+ and pnpm 10.

```bash
pnpm install
pnpm dev
```

The dev server binds `0.0.0.0:4317`. Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

```bash
pnpm typecheck
pnpm test
pnpm build
```

Identity, theme mode, and smooth scroll live in `project.config.ts`. Colors live in `app/tokens.css`. `/styleguide` is a development specimen and stays out of the public nav.
