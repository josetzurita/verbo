"use client";

function cn(...inputs: Array<string | undefined | false | null>) {
  return inputs.filter(Boolean).join(" ");
}

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type VideoHTMLAttributes } from "react";

export type ResponsiveVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  fallback?: ReactNode;
};

export function ResponsiveVideo({
  className,
  poster,
  autoPlay,
  muted,
  playsInline = true,
  controls = true,
  fallback,
  onError,
  children,
  ...props
}: ResponsiveVideoProps) {
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const safeAutoPlay = Boolean(autoPlay) && Boolean(muted) && !reduce;

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (reduce) {
      node.pause();
      return;
    }
    if (safeAutoPlay) {
      void node.play().catch(() => undefined);
    }
  }, [reduce, safeAutoPlay]);

  if (failed && fallback) {
    return <>{fallback}</>;
  }

  return (
    <video
      ref={ref}
      className={cn("h-auto max-w-full", className)}
      poster={poster}
      autoPlay={safeAutoPlay}
      muted={muted ?? safeAutoPlay}
      playsInline={playsInline}
      controls={controls}
      preload={safeAutoPlay ? "metadata" : "none"}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    >
      {children}
    </video>
  );
}
