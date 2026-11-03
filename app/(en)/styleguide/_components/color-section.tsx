import { COLOR_GROUPS, CONTRAST_PAIRS } from "../_data/styleguide-data";
import { ContrastCheck } from "./contrast-check";
import { StyleguideSection } from "./styleguide-section";
import { TokenValue } from "./token-value";

function SwatchCard({
  token,
  cssVar,
  use,
  foreground,
}: {
  token: string;
  cssVar: string;
  use: string;
  foreground: string;
}) {
  return (
    <article className="min-w-44 flex-1">
      <div
        className="h-24 border border-border"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <p className="mt-3 text-sm font-medium">{token}</p>
      <p className="type-mono mt-1 text-foreground/70">{cssVar}</p>
      <p className="type-mono mt-1 text-foreground/70">
        <TokenValue asColor name={cssVar} />
      </p>
      <p className="mt-2 text-xs text-foreground/70">{use}</p>
      <p className="type-mono mt-1 text-xs text-foreground/65">fg {foreground}</p>
    </article>
  );
}

function ThemeBoard({
  theme,
  label,
}: {
  theme: "light" | "dark";
  label: string;
}) {
  return (
    <div
      className="border border-border bg-background p-6 text-foreground"
      data-theme={theme}
    >
      <p className="type-label text-foreground/55">{label}</p>
      <div className="mt-8 space-y-10">
        {COLOR_GROUPS.map((group) => (
          <div key={`${theme}-${group.id}`}>
            <h3 className="type-h4">{group.title}</h3>
            <div className="mt-5 flex gap-6 overflow-x-auto pb-2">
              {group.swatches.map((swatch) => (
                <SwatchCard key={`${theme}-${group.id}-${swatch.token}-${swatch.cssVar}`} {...swatch} />
              ))}
            </div>
          </div>
        ))}
        <div>
          <h3 className="type-h4">Contrast</h3>
          <div className="mt-4">
            {CONTRAST_PAIRS.map((pair) => (
              <ContrastCheck
                backgroundVar={pair.background}
                foregroundVar={pair.foreground}
                key={`${theme}-${pair.name}`}
                name={pair.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ColorSection() {
  return (
    <StyleguideSection
      description="Swatches read live CSS variables. Light and dark boards are isolated with data-theme so both palettes stay visible."
      id="colors"
      title="Colors"
    >
      <div className="grid gap-8 xl:grid-cols-2">
        <ThemeBoard label="Light values" theme="light" />
        <ThemeBoard label="Dark values" theme="dark" />
      </div>
    </StyleguideSection>
  );
}
