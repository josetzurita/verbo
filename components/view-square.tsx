import { viewLabel } from "@/lib/home-content";

// The "View" square pinned to the bottom-right corner of a project image. Visual only: the card's own
// link covers the whole card, so this adds no second link. The parent frame must be positioned.
export function ViewSquare() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 z-[1] flex size-16 items-center justify-center bg-foreground text-base font-light tracking-[-0.03em] text-background md:size-20 md:text-lg"
    >
      {viewLabel}
    </span>
  );
}
