"use client";

import { useLayoutEffect, useRef, useState } from "react";

function parseRgb(value: string): [number, number, number] | null {
  const rgb = value.match(/rgba?\(([^)]+)\)/i);
  if (rgb?.[1]) {
    const parts = rgb[1].split(/[\s,/]+/).map((part) => Number.parseFloat(part.trim()));
    const r = parts[0];
    const g = parts[1];
    const b = parts[2];
    if (r == null || g == null || b == null || Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return null;
    }
    return [r, g, b];
  }
  const hex = value.match(/^#([0-9a-f]{6})/i);
  if (hex?.[1]) {
    return [
      Number.parseInt(hex[1].slice(0, 2), 16),
      Number.parseInt(hex[1].slice(2, 4), 16),
      Number.parseInt(hex[1].slice(4, 6), 16),
    ];
  }
  return null;
}

function channel(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const foreground = toRgb(fg);
  const background = toRgb(bg);
  if (!foreground || !background) {
    return null;
  }
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function toRgb(value: string): [number, number, number] | null {
  const direct = parseRgb(value);
  if (direct) {
    return direct;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  ctx.fillStyle = "#000000";
  ctx.fillStyle = value;
  return parseRgb(ctx.fillStyle);
}

export function ContrastCheck({
  name,
  foregroundVar,
  backgroundVar,
}: {
  name: string;
  foregroundVar: string;
  backgroundVar: string;
}) {
  const pairRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = pairRef.current;
    if (!node) {
      return;
    }
    const styles = getComputedStyle(node);
    setRatio(contrastRatio(styles.color, styles.backgroundColor));
  }, [backgroundVar, foregroundVar]);

  const passAa = ratio != null && ratio >= 4.5;
  const passLarge = ratio != null && ratio >= 3;

  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-3">
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="pointer-events-none size-6 shrink-0 border border-border"
          ref={pairRef}
          style={{
            color: `var(${foregroundVar})`,
            backgroundColor: `var(${backgroundVar})`,
          }}
        />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="type-mono mt-1 text-foreground/65">
            {foregroundVar} on {backgroundVar}
          </p>
        </div>
      </div>
      <p className="type-mono text-sm">
        {ratio == null ? "measuring" : `${ratio.toFixed(2)}:1`}{" "}
        <span className="text-foreground/65">
          {passAa ? "AA body" : passLarge ? "AA large only" : "below AA"}
        </span>
      </p>
    </div>
  );
}
