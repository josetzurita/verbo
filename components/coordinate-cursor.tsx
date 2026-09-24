"use client";

import { Source_Serif_4 } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { FINE_POINTER_QUERY } from "./motion-policy";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

const CURSOR_CLASS = "coordinate-cursor";
const digits = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function CoordinateCursorActive() {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const parts = [horizontalRef, verticalRef, squareRef, labelRef];
    let shown = false;

    const setShown = (next: boolean) => {
      if (next === shown) {
        return;
      }
      shown = next;
      const visibility = next ? "visible" : "hidden";
      for (const part of parts) {
        if (part.current) {
          part.current.style.visibility = visibility;
        }
      }
      document.documentElement.classList.toggle(CURSOR_CLASS, next);
    };

    const place = (x: number, y: number) => {
      const xPos = `${x}px`;
      const yPos = `${y}px`;
      if (horizontalRef.current) {
        horizontalRef.current.style.top = yPos;
      }
      if (verticalRef.current) {
        verticalRef.current.style.left = xPos;
      }
      if (squareRef.current) {
        squareRef.current.style.left = xPos;
        squareRef.current.style.top = yPos;
      }
      if (labelRef.current) {
        labelRef.current.style.left = xPos;
        labelRef.current.style.top = yPos;
      }
      if (xRef.current) {
        xRef.current.textContent = `x: ${digits.format(Math.round(x))}`;
      }
      if (yRef.current) {
        yRef.current.textContent = `y: ${digits.format(Math.round(y))}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!media.matches || event.pointerType === "touch") {
        setShown(false);
        return;
      }
      place(event.clientX, event.clientY);
      setShown(true);
    };

    const hide = () => {
      setShown(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    media.addEventListener("change", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      media.removeEventListener("change", hide);
      document.documentElement.classList.remove(CURSOR_CLASS);
    };
  }, []);

  const layer = "pointer-events-none invisible fixed z-[80]";

  return (
    <>
      <div
        ref={horizontalRef}
        aria-hidden="true"
        className={`${layer} inset-x-0 h-px -translate-y-1/2 bg-[#60433a]`}
      />
      <div
        ref={verticalRef}
        aria-hidden="true"
        className={`${layer} inset-y-0 w-px -translate-x-1/2 bg-[#60433a]`}
      />
      <div
        ref={squareRef}
        aria-hidden="true"
        className={`${layer} size-[7px] -translate-x-1/2 -translate-y-1/2 bg-[#faab2a]`}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        className={`${sourceSerif.className} ${layer} flex -translate-x-[calc(100%+6px)] -translate-y-[calc(100%+7px)] flex-col text-[10px] font-light leading-none tracking-[0.2px] text-[#faab2a]`}
      >
        <span ref={xRef} className="block whitespace-nowrap leading-none">
          x: 0
        </span>
        <span ref={yRef} className="block whitespace-nowrap leading-none">
          y: 0
        </span>
      </div>
    </>
  );
}

export function CoordinateCursor() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => {
      setFinePointer(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  if (!finePointer) {
    return null;
  }

  return <CoordinateCursorActive />;
}
