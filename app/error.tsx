"use client";

import { ErrorFoundation } from "../components/error-foundation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFoundation error={error} reset={reset} />;
}
