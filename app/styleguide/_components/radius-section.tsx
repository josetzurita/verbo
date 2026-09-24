import { RADIUS_SPECIMENS } from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";
import { TokenValue } from "./token-value";

export function RadiusSection() {
  return (
    <StyleguideSection
      description="One radius scale. Elevation exists only where the starter actually uses it: dialogs."
      id="radius"
      title="Radius, borders, and elevation"
    >
      <SpecimenTable columns={["Token", "Value", "Use", "Sample"]}>
        {RADIUS_SPECIMENS.map((item) => (
          <tr key={item.token}>
            <SpecimenCell sticky>
              <span className="type-mono">{item.cssVar}</span>
            </SpecimenCell>
            <SpecimenCell>
              <TokenValue name={item.cssVar} />
            </SpecimenCell>
            <SpecimenCell>{item.use}</SpecimenCell>
            <SpecimenCell>
              <div
                className="size-20 border border-border bg-surface-muted"
                style={{ borderRadius: `var(${item.cssVar})` }}
              />
            </SpecimenCell>
          </tr>
        ))}
        <tr>
          <SpecimenCell sticky>
            <span className="type-mono">--border</span>
          </SpecimenCell>
          <SpecimenCell>
            <TokenValue asColor name="--border" />
          </SpecimenCell>
          <SpecimenCell>Hairline separators and control edges</SpecimenCell>
          <SpecimenCell>
            <div className="h-12 border border-border bg-surface" />
          </SpecimenCell>
        </tr>
        <tr>
          <SpecimenCell sticky>
            <span className="type-mono">--ring</span>
          </SpecimenCell>
          <SpecimenCell>
            <TokenValue asColor name="--ring" />
          </SpecimenCell>
          <SpecimenCell>Keyboard focus ring</SpecimenCell>
          <SpecimenCell>
            <div className="inline-flex h-10 items-center border border-transparent bg-surface px-4 text-sm ring-2 ring-ring ring-offset-2 ring-offset-background">
              Focus sample
            </div>
          </SpecimenCell>
        </tr>
        <tr>
          <SpecimenCell sticky>
            <span className="type-mono">--elevation-dialog</span>
          </SpecimenCell>
          <SpecimenCell>
            <TokenValue name="--elevation-dialog" />
          </SpecimenCell>
          <SpecimenCell>Dialog lift only. No decorative drop shadows.</SpecimenCell>
          <SpecimenCell>
            <div
              className="h-16 w-28 rounded-[var(--radius-lg)] border border-border bg-surface"
              style={{ boxShadow: "var(--elevation-dialog)" }}
            />
          </SpecimenCell>
        </tr>
      </SpecimenTable>
    </StyleguideSection>
  );
}
