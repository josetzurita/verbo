"use client";

import type { ImageLoaderProps } from "next/image";
import imageLoader from "@/lib/image-loader";
import { ResponsiveImage, type ResponsiveImageProps } from "./responsive-image";

// Case pages ask Sanity for four widths only, so visitors share cached transforms instead of each
// paying for a cold one. Widths round up, so a Retina screen still gets at least what it needs.
const STEPS = [640, 1080, 1600, 2560] as const;
const LARGEST = 2560;
// Brand work is shown large, so it gets more than the loader's default 75. auto=format keeps it light.
// scripts/warm-case-images.mjs repeats these widths and this quality; change them together.
const CASE_QUALITY = 85;

function caseLoader({ src, width, quality }: ImageLoaderProps) {
  const step = STEPS.find((candidate) => candidate >= width) ?? LARGEST;
  return imageLoader({ src, width: step, quality });
}

/** The same widths and quality as a plain srcset, for <img> tags outside next/image (the intro loader). */
export function caseSrcSet(src: string): string | undefined {
  if (imageLoader({ src, width: LARGEST }) === src) {
    return undefined;
  }
  return STEPS.map((step) => `${imageLoader({ src, width: step, quality: CASE_QUALITY })} ${step}w`).join(", ");
}

type CasePhotoProps =Omit<ResponsiveImageProps, "loader" | "placeholder" | "blurDataURL"> & {
  /** Sanity lqip. Shown blurred until the image arrives. */
  lqip?: string;
};

export function CasePhoto({ lqip, quality = CASE_QUALITY, ...props }: CasePhotoProps) {
  return (
    <ResponsiveImage
      loader={caseLoader}
      quality={quality}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      {...props}
    />
  );
}
