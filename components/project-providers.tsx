"use client";

import { PointerAccent } from "./pointer-accent";
import { MotionProfileProvider } from "./motion-profile-provider";
import { MotionProvider } from "./motion-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";
import type { ReactNode } from "react";
import type { ProjectConfig } from "../lib/project-config";
import { RouteTransitionProvider } from "./route-transition-provider";
import type { RouteTransitionRenderOverlay } from "./route-transition-types";

export type ProjectProvidersProps = {
  config: ProjectConfig;
  children: ReactNode;
  renderOverlay?: RouteTransitionRenderOverlay;
  transitionTimeoutMs?: number;
};

export function ProjectProviders({
  config,
  children,
  renderOverlay,
  transitionTimeoutMs,
}: ProjectProvidersProps) {
  const overlayEnabled = config.motion.pageTransition === "overlay";
  const withTransition = overlayEnabled ? (
    <RouteTransitionProvider
      enabled
      timeoutMs={transitionTimeoutMs}
      renderOverlay={renderOverlay}
    >
      {children}
    </RouteTransitionProvider>
  ) : (
    children
  );

  const withScroll = config.motion.smoothScroll ? (
    <SmoothScrollProvider>{withTransition}</SmoothScrollProvider>
  ) : (
    withTransition
  );

  return (
    <MotionProvider>
      <MotionProfileProvider>
        {withScroll}
        {config.pointerAccent.enabled ? (
          <PointerAccent {...config.pointerAccent} />
        ) : null}
      </MotionProfileProvider>
    </MotionProvider>
  );
}
