# Prompt: fix slow scroll on a page with many fixed / pinned elements

Paste the block below into the other project. It is a guide to the approach used in Verbo, not a spec. Adapt names to the stack there.

---

## Prompt

The page scrolls slowly (drops frames) in some sections. It has many `position: fixed` / sticky / pinned elements stacked at once. Diagnose first, then fix. Do not redesign or restyle. The visuals are final; only change how they are built and driven.

### 1. Diagnose before touching code

- Record a Performance trace in Chrome DevTools while scrolling the slow sections. Look for long "Layout", "Recalculate style", "Paint" and large "Composite layers" bars.
- Turn on Rendering > Paint flashing and Layer borders. Anything repainting every frame during scroll is a bug.
- List every `fixed`, `sticky`, ScrollTrigger `pin` and full-viewport layer, and which ones are alive at the same time in the slow sections. Report this list first.
- Check the target: test on a small laptop screen (1512x982), not only on a large monitor. Big screens hide the cost because fewer layers overlap.

### 2. Rules to apply

- **Animate only `transform` and `opacity`.** Never animate `top/left/width/height/margin/filter/box-shadow/clip-path` per frame. If a blur or filter is needed, do it on a static layer and fade its opacity.
- **One scroll engine, one clock.** If using Lenis plus GSAP: exactly one Lenis instance, driven from `gsap.ticker` (`lenis.raf(time * 1000)`), `lenis.on("scroll", ScrollTrigger.update)`, and `gsap.ticker.lagSmoothing(0)` so the two never fight. No second `requestAnimationFrame` loop, no duplicate scroll listeners.
- **Fewer pins, shorter pins.** Prefer one ScrollTrigger pinning one track and moving children inside it with transforms, instead of many independent pins. Avoid long pin distances. Replace "fixed layers that are always on" with sections that are only mounted/visible near the viewport.
- **Reveal footers with a spacer, not extra pins.** A fixed footer under the page plus a `100dvh` spacer above it is one layer, not a pin.
- **Cap how many large layers are alive.** Full-viewport fixed layers with big images, video or blur are the expensive ones. Hide with `visibility: hidden` / `opacity: 0` when off-screen, and don't leave `will-change` on everything (use it only on the few elements that actually animate, and remove it when idle).
- **Smoothing that follows scroll must be cheap.** Drive progress with `gsap.quickTo` (one tween updated in place) instead of creating new tweens per scroll event. Keep Lenis `lerp` high enough (we use `0.25`; `0.1` felt slow and laggy).
- **Scrubbed text effects:** measure/split text once (resize-safe), then only animate opacity/transform of the pieces. Do not re-measure in the scroll handler.
- **Free scroll.** No scroll locking, no forced jumps, no long pins. A soft "settle" to the nearest snap point is fine only after a short quiet period (we use ~140ms) and any input must cancel it.
- **Cursor / hover effects** only when `(pointer: fine) and (hover: hover)`.
- **Every motion block** is created inside `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` branch, plus a reduce branch that sets the end state. Return `mm.revert()` for cleanup so nothing leaks between route changes.
- **Small screens:** below ~768px render a plain stacked "reading" version instead of the pinned experience.

### 3. Laptop pass

Add a single media query for short desktops, for example `@media (min-width: 768px) and (max-height: 1100px)`, that scales the large composition down (type, gaps, card sizes, pin distances). Keep all laptop fixes in that block so tall screens stay untouched.

### 4. Deliver

1. The list of fixed/pinned/full-viewport layers and which overlap in the slow sections.
2. The changes, smallest first, each with the reason.
3. A before/after note per slow section (trace shows no long frames, no per-frame paint).
4. Confirm it works at 1512x982 and on a large monitor, with reduced motion on, and that `typecheck`, `lint` and `build` pass.

---

## What we actually did in Verbo (for reference)

- Lenis `lerp` 0.1 -> 0.25, single instance, synced to `gsap.ticker` with `lagSmoothing(0)`.
- Cut the belief section spacer from `80dvh` to `40dvh` so the next section covers it sooner (fewer overlapping layers).
- Work section: one pinned `.work-track`; cards step by a fixed viewport fraction, progress via `gsap.quickTo`, soft settle after 140ms of quiet.
- Footer: fixed and revealed by a `100dvh` spacer instead of another pin.
- Laptop-only scaling in one `max-height: 1100px` block.
- Mobile and reduced motion: static reading layouts instead of pins.
