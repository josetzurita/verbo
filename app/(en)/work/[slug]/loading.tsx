export default function CaseStudyLoading() {
  return (
    <div className="theme-paper min-h-[100dvh] px-5 pt-24 pb-12 md:px-12" aria-busy="true" aria-live="polite">
      <p className="text-sm font-light">Loading case study</p>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="grid content-start gap-6">
          <div className="h-4 w-40 bg-surface" />
          <div className="h-14 w-full max-w-md bg-surface" />
          <div className="h-14 w-4/5 max-w-sm bg-surface" />
          <div className="h-5 w-full max-w-sm bg-surface" />
          <div className="h-12 w-32 bg-surface" />
        </div>
        <div className="aspect-[4/3] bg-surface lg:aspect-[4/5]" />
      </div>
    </div>
  );
}
