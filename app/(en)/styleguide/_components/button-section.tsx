import { Button } from "@/components/button";
import { BUTTON_SPECIMEN_STATES } from "@/components/button-variants";
import { BUTTON_MATRIX, BUTTON_SIZE_ROWS } from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";

const STATE_LABELS: Record<(typeof BUTTON_SPECIMEN_STATES)[number], string> = {
  default: "Default",
  hover: "Hover",
  pressed: "Pressed",
  focus: "Focused",
  disabled: "Disabled",
  loading: "Loading",
};

export function ButtonSection() {
  return (
    <StyleguideSection
      description="Forced specimen states use the production Button. Focus remains a visible ring. Do not restyle buttons only on this page."
      id="buttons"
      title="Buttons"
    >
      {BUTTON_MATRIX.map((row) => (
        <div className="mt-10 first:mt-0" key={row.variant}>
          <h3 className="type-h4">{row.label}</h3>
          <div className="mt-5">
            <SpecimenTable
              columns={["Size", ...BUTTON_SPECIMEN_STATES.map((state) => STATE_LABELS[state])]}
              minWidthClass="min-w-[72rem]"
            >
              {BUTTON_SIZE_ROWS.map((sizeRow) => (
                <tr key={`${row.variant}-${sizeRow.size}`}>
                  <SpecimenCell sticky>
                    <span className="type-mono">{sizeRow.label}</span>
                  </SpecimenCell>
                  {BUTTON_SPECIMEN_STATES.map((state) => (
                    <SpecimenCell key={state}>
                      <Button size={sizeRow.size} specimenState={state} variant={row.variant}>
                        Action
                      </Button>
                    </SpecimenCell>
                  ))}
                </tr>
              ))}
            </SpecimenTable>
          </div>
        </div>
      ))}
    </StyleguideSection>
  );
}
