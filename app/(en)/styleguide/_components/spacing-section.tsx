import {
  COMPONENT_SPACING,
  GUTTER_SPACING,
  SECTION_SPACING,
  type SpacingRow,
} from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";
import { TokenValue } from "./token-value";

function SpacingTable({ title, rows }: { title: string; rows: SpacingRow[] }) {
  const showBreakpoints = rows.some((row) => row.mobileVar || row.tabletVar || row.desktopVar);
  return (
    <div>
      <h3 className="type-h4">{title}</h3>
      <div className="mt-6">
        <SpecimenTable
          columns={
            showBreakpoints
              ? ["Token", "CSS variable", "Mobile", "Tablet", "Desktop", "Bar", "Use"]
              : ["Token", "CSS variable", "Value", "Bar", "Use"]
          }
          minWidthClass="min-w-[60rem]"
        >
          {rows.map((row) => (
            <tr key={row.token}>
              <SpecimenCell sticky>
                <span className="font-medium">{row.token}</span>
              </SpecimenCell>
              <SpecimenCell>
                <span className="type-mono">{row.cssVar}</span>
              </SpecimenCell>
              {showBreakpoints ? (
                <>
                  <SpecimenCell>
                    {row.mobileVar ? <TokenValue name={row.mobileVar} /> : "same"}
                  </SpecimenCell>
                  <SpecimenCell>
                    {row.tabletVar ? <TokenValue name={row.tabletVar} /> : "same"}
                  </SpecimenCell>
                  <SpecimenCell>
                    {row.desktopVar ? <TokenValue name={row.desktopVar} /> : "same"}
                  </SpecimenCell>
                </>
              ) : (
                <SpecimenCell>
                  <TokenValue name={row.cssVar} />
                </SpecimenCell>
              )}
              <SpecimenCell>
                <div
                  className="h-3 bg-accent"
                  style={{ width: `var(${row.cssVar})` }}
                />
              </SpecimenCell>
              <SpecimenCell>{row.use}</SpecimenCell>
            </tr>
          ))}
        </SpecimenTable>
      </div>
    </div>
  );
}

export function SpacingSection() {
  return (
    <StyleguideSection
      description="A short scale only. Section space changes across breakpoints. Component space stays numeric."
      id="spacing"
      title="Spacing system"
    >
      <div className="space-y-14">
        <SpacingTable rows={SECTION_SPACING} title="Vertical section spacing" />
        <SpacingTable rows={COMPONENT_SPACING} title="Component spacing" />
        <SpacingTable rows={GUTTER_SPACING} title="Horizontal gutters" />
      </div>
    </StyleguideSection>
  );
}
