import type { Viewport } from "next";

// Edge to edge on phones: the page runs under the status bar and the browser toolbar. Safari 26 ignores
// theme-color (EdgeTint steers its tint); Android Chrome and older iOS still read it. #39170d is the field color.
export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#39170d",
};
