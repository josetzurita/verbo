import type Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "./gsap";

type SyncRecord = {
  ticker: (time: number) => void;
  onScroll: () => void;
  boundLenis: Lenis | null;
};

let active: SyncRecord | null = null;

export function getGsapLenisSyncCount(): number {
  return active ? 1 : 0;
}

export function attachGsapLenisSync(
  getLenis: () => Lenis | null | undefined,
): () => void {
  registerGsap();

  if (active) {
    detach(active);
  }

  const onScroll = () => {
    ScrollTrigger.update();
  };

  const record: SyncRecord = {
    ticker: (time: number) => {
      const lenis = getLenis();
      if (!lenis) {
        return;
      }
      if (record.boundLenis !== lenis) {
        record.boundLenis?.off("scroll", onScroll);
        lenis.on("scroll", onScroll);
        record.boundLenis = lenis;
      }
      lenis.raf(time * 1000);
    },
    onScroll,
    boundLenis: null,
  };

  gsap.ticker.add(record.ticker);
  gsap.ticker.lagSmoothing(0);
  active = record;

  return () => {
    detach(record);
  };
}

function detach(record: SyncRecord) {
  if (active !== record) {
    return;
  }
  gsap.ticker.remove(record.ticker);
  record.boundLenis?.off("scroll", record.onScroll);
  gsap.ticker.lagSmoothing(500, 33);
  active = null;
}
