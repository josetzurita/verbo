import type { ReactNode } from "react";

export function StyleguideSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-20 border-t border-border py-16" id={id}>
      <h2 className="type-h2 max-w-[22ch]">{title}</h2>
      {description ? (
        <p className="type-body mt-4 max-w-[65ch] text-foreground/75">{description}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}
