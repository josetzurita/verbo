import type { LegalDocument } from "@/lib/legal-content";

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article className="content-reading min-h-[100dvh] pt-32 pb-24 md:pt-[11rem]">
      <p className="type-label text-copy">Updated {document.updated}</p>
      <h1 className="type-h1 mt-4">{document.title}</h1>
      <p className="type-body-lg mt-8 text-copy">{document.intro}</p>
      {document.sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="type-h3">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="type-body mt-4 text-copy">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="type-body mt-4 list-disc space-y-2 pl-6 text-copy marker:text-foreground">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
