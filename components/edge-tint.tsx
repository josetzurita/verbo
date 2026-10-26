"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// With viewport-fit=cover the page runs under Safari's bars; where it runs out (the end of the page, an
// overscroll) Safari shows the html/body background. Any fixed element touching a screen edge switches it to
// solid bars instead, so on phones nothing fixed touches the top or bottom edge. On phones this keeps
// html/body the color of the section at the bottom edge, so arriving at the footer the area under the
// toolbar is already the footer's paper.
const SOURCE = "section, footer, [data-edge-source], [data-theme], .theme-paper";

function colorAt(y: number) {
  for (const node of document.elementsFromPoint(window.innerWidth / 2, y)) {
    if (node === document.documentElement || node === document.body || !node.matches(SOURCE)) {
      continue;
    }
    const color = getComputedStyle(node).backgroundColor;
    if (color && color !== "transparent" && !/\/\s*0\)|,\s*0\)$/.test(color)) {
      return color;
    }
  }
  return null;
}

export function EdgeTint() {
  // The layout keeps this mounted across routes, so re-measure on every navigation.
  const pathname = usePathname();

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const { documentElement: html, body } = document;
    let frame = 0;
    let last = "";

    const clear = () => {
      html.style.removeProperty("background-color");
      body.style.removeProperty("background-color");
      last = "";
    };
    const update = () => {
      frame = 0;
      if (!phone.matches) {
        clear();
        return;
      }
      const edge = colorAt(window.innerHeight - 4);
      // Pages with no tinted section at the edge (the legal pages) fall back to the stylesheet color.
      if (!edge) {
        clear();
        return;
      }
      if (edge !== last) {
        last = edge;
        html.style.backgroundColor = edge;
        body.style.backgroundColor = edge;
      }
    };
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    phone.addEventListener("change", schedule);
    const settle = window.setTimeout(update, 1500);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      phone.removeEventListener("change", schedule);
      clear();
    };
  }, [pathname]);

  return null;
}
