"use client";

export function ErrorFoundation({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        Error
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">
        The page could not finish rendering.
      </h1>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-foreground/75">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        className="mt-6 rounded-[var(--radius-md)] border border-border px-4 py-2 text-sm"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
