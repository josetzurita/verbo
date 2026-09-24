import { CONTAINER_SPECIMENS } from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";
import { TokenValue } from "./token-value";

export function ContainerSection() {
  return (
    <StyleguideSection
      description="Widths come from container tokens. Gutters follow the responsive --gutter scale. The 12-column grid is a layout tool, not a dashboard."
      id="containers"
      title="Containers and grid"
    >
      <SpecimenTable
        columns={["Token", "Maximum width", "Side gutter", "Use", "Preview"]}
        minWidthClass="min-w-[70rem]"
      >
        {CONTAINER_SPECIMENS.map((item) => (
          <tr key={item.token}>
            <SpecimenCell sticky>
              <p className="font-medium">{item.token}</p>
              <p className="type-mono mt-1 text-foreground/65">{item.className}</p>
            </SpecimenCell>
            <SpecimenCell>
              <TokenValue name={item.maxWidthVar} />
            </SpecimenCell>
            <SpecimenCell>
              <TokenValue name={item.gutterVar} />
            </SpecimenCell>
            <SpecimenCell>{item.use}</SpecimenCell>
            <SpecimenCell className="w-[28rem]">
              <div className="border border-border bg-surface-muted">
                <div
                  className="mx-auto border-x border-dashed border-border bg-surface py-6 text-center type-mono text-xs"
                  style={{
                    maxWidth: `min(100%, var(${item.maxWidthVar}))`,
                    paddingInline: "var(--gutter)",
                  }}
                >
                  {item.className}
                </div>
              </div>
            </SpecimenCell>
          </tr>
        ))}
        <tr>
          <SpecimenCell sticky>
            <p className="font-medium">page gutter</p>
            <p className="type-mono mt-1 text-foreground/65">page-gutter</p>
          </SpecimenCell>
          <SpecimenCell>full viewport</SpecimenCell>
          <SpecimenCell>
            <TokenValue name="--gutter" />
          </SpecimenCell>
          <SpecimenCell>Horizontal inset without a max width</SpecimenCell>
          <SpecimenCell>
            <div className="page-gutter border border-border bg-surface-muted py-4">
              <div className="border border-dashed border-border bg-surface py-3 text-center type-mono text-xs">
                inset
              </div>
            </div>
          </SpecimenCell>
        </tr>
      </SpecimenTable>

      <h3 className="type-h4 mt-14">12-column grid</h3>
      <p className="type-mono mt-2 text-foreground/65">content-grid / --grid-gap</p>
      <div className="content-grid mt-6">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            className="min-h-16 border border-border bg-surface-muted py-6 text-center type-mono text-xs"
            key={index}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </StyleguideSection>
  );
}
