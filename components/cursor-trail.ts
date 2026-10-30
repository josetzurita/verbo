import { gsap } from "./gsap";

/** Opt a control into the shared cursor image trail. */
export const cursorTrailAttribute = {
  "data-cursor-trail": "",
} as const;

const SELECTOR = "[data-cursor-trail]";
const FRAME_WIDTH = 195;
const FRAME_HEIGHT = 210;
const SPAWN_MS = 140;
const SCALE_DURATION = 0.32;
const EXIT_STAGGER = 0.06;
const SHIFT_PX = 18;
const LAG_STEP = 0.14;
const MAX_FRAMES = 8;

type Crop = {
  src: string;
  stroke: string;
  width: number;
  height: number;
  left: string;
  top: string;
  transform: string;
};

type Offset = {
  x: number;
  y: number;
};

export type TrailAimX = "right" | "left" | "center";
export type TrailAimY = "top" | "bottom" | "level";

export type TrailAim = {
  x: TrailAimX;
  y: TrailAimY;
};

const DEFAULT_AIM: TrailAim = { x: "right", y: "top" };

export type TrailSpacing = {
  spread: number;
  inset: number;
};

const DEFAULT_SPACING: TrailSpacing = { spread: 1, inset: 0 };

type LiveFrame = {
  el: HTMLDivElement;
  offset: Offset;
  xTo: (value: number) => void;
  yTo: (value: number) => void;
};

export type TrailSet = "brand" | "people";

const brandCrops: readonly Crop[] = [
  {
    src: "/cursor-trail/face.png",
    stroke: "var(--trail-amber)",
    width: 195,
    height: 273.551,
    left: "50%",
    top: "calc(50% - 22.66px)",
    transform: "translate(-50%, -50%)",
  },
  {
    src: "/cursor-trail/facade.png",
    stroke: "var(--foreground)",
    width: 346.283,
    height: 210,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  {
    src: "/cursor-trail/window.png",
    stroke: "var(--trail-blue)",
    width: 195,
    height: 275.742,
    left: "-0.5px",
    top: "-0.5px",
    transform: "none",
  },
  {
    src: "/cursor-trail/vessel.png",
    stroke: "var(--trail-yellow)",
    width: 195,
    height: 256.609,
    left: "50%",
    top: "calc(50% + 18.47px)",
    transform: "translate(-50%, -50%)",
  },
];

const peopleFrame = {
  src: "/about/portrait.webp",
  width: 280,
  height: 420,
  left: "50%",
  top: "-72px",
  transform: "translateX(-50%)",
} as const;

const peopleCrops: readonly Crop[] = [
  { ...peopleFrame, stroke: "var(--trail-yellow)" },
  { ...peopleFrame, stroke: "var(--foreground)" },
  { ...peopleFrame, stroke: "var(--trail-blue)" },
  { ...peopleFrame, stroke: "var(--about-card-plain)" },
  { ...peopleFrame, stroke: "var(--trail-amber)" },
];

function cropsFor(set: TrailSet): readonly Crop[] {
  return set === "people" ? peopleCrops : brandCrops;
}

/** Bottom-left of each frame, relative to the cursor. The first four match the Figma fan. */
const offsets: readonly Offset[] = [
  { x: 0, y: 0 },
  { x: 41.5, y: -40.5 },
  { x: 73.5, y: -108.5 },
  { x: 177.5, y: -138.6 },
  { x: 263.5, y: -180.6 },
  { x: 335.5, y: -216.6 },
  { x: 433.5, y: -244.6 },
  { x: 513.5, y: -278.6 },
];

function isElement(value: EventTarget | null): value is Element {
  return value instanceof Element;
}

export function isCursorTrailTarget(target: EventTarget | null): boolean {
  return isElement(target) && Boolean(target.closest(SELECTOR));
}

export function cursorTrailControl(target: EventTarget | null): HTMLElement | null {
  if (!isElement(target)) {
    return null;
  }
  const control = target.closest(SELECTOR);
  return control instanceof HTMLElement ? control : null;
}

function isAimX(value: string | null | undefined): value is TrailAimX {
  return value === "right" || value === "left" || value === "center";
}

function isAimY(value: string | null | undefined): value is TrailAimY {
  return value === "top" || value === "bottom" || value === "level";
}

export function cursorTrailAim(target: EventTarget | null): TrailAim {
  if (!isElement(target)) {
    return DEFAULT_AIM;
  }
  const control = target.closest(SELECTOR);
  const x = control?.getAttribute("data-cursor-trail-x");
  const y = control?.getAttribute("data-cursor-trail-y");
  return {
    x: isAimX(x) ? x : DEFAULT_AIM.x,
    y: isAimY(y) ? y : DEFAULT_AIM.y,
  };
}

export function cursorTrailSpacing(target: EventTarget | null): TrailSpacing {
  if (!isElement(target)) {
    return DEFAULT_SPACING;
  }
  const control = target.closest(SELECTOR);
  const spread = Number(control?.getAttribute("data-cursor-trail-spread"));
  const inset = Number(control?.getAttribute("data-cursor-trail-inset"));
  return {
    spread: Number.isFinite(spread) && spread > 0 ? spread : DEFAULT_SPACING.spread,
    inset: Number.isFinite(inset) ? inset : DEFAULT_SPACING.inset,
  };
}

export function cursorTrailSet(target: EventTarget | null): TrailSet {
  if (!isElement(target)) {
    return "brand";
  }
  return target.closest(SELECTOR)?.getAttribute("data-cursor-trail-set") === "people" ? "people" : "brand";
}

export function cursorTrailCount(target: EventTarget | null): number {
  if (!isElement(target)) {
    return MAX_FRAMES;
  }
  const raw = Number(target.closest(SELECTOR)?.getAttribute("data-cursor-trail-count"));
  if (!Number.isFinite(raw) || raw < 1) {
    return MAX_FRAMES;
  }
  return Math.min(MAX_FRAMES, Math.floor(raw));
}

function jitter(): number {
  return (Math.random() - 0.5) * SHIFT_PX * 2;
}

/** Sign the shared step distances. Top-right matches the original fan, including the 210px lift. */
function aimedOffset(
  step: Offset,
  aim: TrailAim,
  spacing: TrailSpacing,
): { offset: Offset; origin: string } {
  const xStep = Math.abs(step.x) * spacing.spread;
  const yStep = Math.abs(step.y) * spacing.spread;
  let x = jitter();
  if (aim.x === "right") {
    x += xStep + spacing.inset;
  } else if (aim.x === "left") {
    x -= FRAME_WIDTH + xStep + spacing.inset;
  }
  let y = jitter();
  if (aim.y === "bottom") {
    y += yStep;
  } else if (aim.y === "top") {
    y -= yStep + FRAME_HEIGHT;
  } else {
    y -= FRAME_HEIGHT;
  }
  const originX = aim.x === "left" ? "100%" : "0%";
  const originY = aim.y === "bottom" ? "0%" : "100%";
  return { offset: { x, y }, origin: `${originX} ${originY}` };
}

export function mountCursorTrail(options: {
  follow: { duration: number; ease: string };
  onActiveChange: (active: boolean) => void;
}) {
  let frames: LiveFrame[] = [];
  let exiting: LiveFrame[] = [];
  let control: HTMLElement | null = null;
  let active = false;
  let timer = 0;
  let targetX = 0;
  let targetY = 0;
  let renderedX = 0;
  let renderedY = 0;
  let aim: TrailAim = DEFAULT_AIM;
  let spacing: TrailSpacing = DEFAULT_SPACING;
  let limit = MAX_FRAMES;
  let trailSet: TrailSet = "brand";
  let activeCrops: readonly Crop[] = brandCrops;

  const placeFrame = (frame: LiveFrame, x: number, y: number, snap: boolean) => {
    const nextX = x + frame.offset.x;
    const nextY = y + frame.offset.y;
    if (snap) {
      gsap.set(frame.el, { x: nextX, y: nextY });
      return;
    }
    frame.xTo(nextX);
    frame.yTo(nextY);
  };

  const syncAll = (snap: boolean) => {
    for (const frame of frames) {
      placeFrame(frame, targetX, targetY, snap);
    }
    for (const frame of exiting) {
      placeFrame(frame, targetX, targetY, snap);
    }
  };

  const bind = (next: HTMLElement) => {
    control = next;
    for (const frame of frames) {
      next.appendChild(frame.el);
    }
    for (const frame of exiting) {
      next.appendChild(frame.el);
    }
  };

  const spawn = () => {
    if (!active || !control || frames.length >= limit) {
      return;
    }
    const index = frames.length;
    const offset = offsets[index];
    const crop = activeCrops[index % activeCrops.length];
    if (!offset || !crop) {
      return;
    }

    const el = document.createElement("div");
    el.className =
      "pointer-events-none fixed top-0 left-0 box-border h-[210px] w-[195px] overflow-hidden border border-solid";
    el.style.borderColor = crop.stroke;
    el.style.zIndex = String(MAX_FRAMES - index);

    const image = document.createElement("img");
    image.src = crop.src;
    image.alt = "";
    image.draggable = false;
    image.className = "pointer-events-none absolute max-w-none";
    image.style.width = `${crop.width}px`;
    image.style.height = `${crop.height}px`;
    image.style.left = crop.left;
    image.style.top = crop.top;
    image.style.transform = crop.transform;
    el.appendChild(image);
    control.appendChild(el);

    const settled = aimedOffset(offset, aim, spacing);
    const lag = {
      duration: options.follow.duration + index * LAG_STEP,
      ease: options.follow.ease,
    };
    gsap.set(el, {
      x: renderedX + settled.offset.x,
      y: renderedY + settled.offset.y,
      scale: 0,
      transformOrigin: settled.origin,
    });
    const frame: LiveFrame = {
      el,
      offset: settled.offset,
      xTo: gsap.quickTo(el, "x", lag),
      yTo: gsap.quickTo(el, "y", lag),
    };
    frames.push(frame);
    placeFrame(frame, targetX, targetY, false);
    gsap.to(el, { scale: 1, duration: SCALE_DURATION, ease: "power3.out" });

    if (frames.length >= limit) {
      window.clearInterval(timer);
      timer = 0;
    }
  };

  const startTimer = () => {
    window.clearInterval(timer);
    timer = window.setInterval(spawn, SPAWN_MS);
  };

  return {
    sync(nextTargetX: number, nextTargetY: number, nextRenderedX: number, nextRenderedY: number, snap: boolean) {
      targetX = nextTargetX;
      targetY = nextTargetY;
      renderedX = nextRenderedX;
      renderedY = nextRenderedY;
      syncAll(snap);
    },
    enter(
      x: number,
      y: number,
      nextControl: HTMLElement,
      nextAim: TrailAim = DEFAULT_AIM,
      nextSpacing: TrailSpacing = DEFAULT_SPACING,
      nextLimit = MAX_FRAMES,
      nextSet: TrailSet = "brand",
    ) {
      const setChanged = nextSet !== trailSet;
      aim = nextAim;
      spacing = nextSpacing;
      limit = nextLimit;
      trailSet = nextSet;
      activeCrops = cropsFor(nextSet);
      if (setChanged) {
        for (const frame of [...frames, ...exiting]) {
          gsap.killTweensOf(frame.el);
          frame.el.remove();
        }
        frames = [];
        exiting = [];
        active = false;
        window.clearInterval(timer);
        timer = 0;
      }
      bind(nextControl);
      targetX = x;
      targetY = y;
      if (renderedX === 0 && renderedY === 0) {
        renderedX = x;
        renderedY = y;
      }
      if (active) {
        if (frames.length >= limit) {
          window.clearInterval(timer);
          timer = 0;
        } else if (!timer) {
          startTimer();
        }
        return;
      }
      for (const frame of exiting) {
        gsap.killTweensOf(frame.el, "scale");
        gsap.to(frame.el, {
          scale: 1,
          duration: SCALE_DURATION,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      frames = exiting;
      exiting = [];
      while (frames.length > limit) {
        const extra = frames.pop();
        extra?.el.remove();
      }
      active = true;
      options.onActiveChange(true);
      if (frames.length === 0) {
        spawn();
      }
      if (frames.length < limit) {
        startTimer();
      }
    },
    leave() {
      if (!active) {
        return;
      }
      active = false;
      window.clearInterval(timer);
      timer = 0;
      options.onActiveChange(false);
      const snapshot = frames;
      frames = [];
      exiting = snapshot;
      if (snapshot.length === 0) {
        return;
      }
      snapshot
        .slice()
        .reverse()
        .forEach((frame, index) => {
          gsap.killTweensOf(frame.el, "scale");
          gsap.to(frame.el, {
            scale: 0,
            duration: SCALE_DURATION,
            delay: index * EXIT_STAGGER,
            ease: "power3.in",
            overwrite: "auto",
            onComplete: () => {
              const at = exiting.indexOf(frame);
              if (at >= 0) {
                exiting.splice(at, 1);
              }
              frame.el.remove();
            },
          });
        });
    },
    destroy() {
      active = false;
      window.clearInterval(timer);
      timer = 0;
      for (const frame of [...frames, ...exiting]) {
        gsap.killTweensOf(frame.el);
        frame.el.remove();
      }
      frames = [];
      exiting = [];
    },
  };
}
