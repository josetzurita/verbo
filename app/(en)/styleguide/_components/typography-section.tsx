import { TYPE_ROLES } from "../_data/styleguide-data";
import { SpecimenCell, SpecimenTable } from "./specimen-table";
import { StyleguideSection } from "./styleguide-section";
import { TokenValue } from "./token-value";

function TypeTable({
  title,
  group,
}: {
  title: string;
  group: "headlines" | "body" | "utility";
}) {
  const rows = TYPE_ROLES.filter((role) => role.group === group);
  return (
    <div>
      <h3 className="type-h4">{title}</h3>
      <div className="mt-6">
        <SpecimenTable
          columns={[
            "Token",
            "Desktop",
            "Mobile",
            "Line height",
            "Weight",
            "Tracking",
            "Sample",
          ]}
        >
          {rows.map((role) => (
            <tr key={role.token}>
              <SpecimenCell sticky>
                <p className="font-medium">{role.token}</p>
                <p className="type-mono mt-1 text-foreground/65">{role.className}</p>
              </SpecimenCell>
              <SpecimenCell>
                <TokenValue name={role.desktopVar} />
              </SpecimenCell>
              <SpecimenCell>
                <TokenValue name={role.mobileVar} />
              </SpecimenCell>
              <SpecimenCell>
                <TokenValue name={role.leadingVar} />
              </SpecimenCell>
              <SpecimenCell>
                <TokenValue name={role.weightVar} />
              </SpecimenCell>
              <SpecimenCell>
                <TokenValue name={role.trackingVar} />
              </SpecimenCell>
              <SpecimenCell className="min-w-80">
                <p className={`${role.className} max-w-[36rem] whitespace-normal`}>{role.sample}</p>
              </SpecimenCell>
            </tr>
          ))}
        </SpecimenTable>
      </div>
    </div>
  );
}

export function TypographySection() {
  return (
    <StyleguideSection
      description="Live samples use the project type roles in tokens.css. Change the CSS variables to restyle every generated site."
      id="typography"
      title="Typography"
    >
      <div className="space-y-16">
        <TypeTable group="headlines" title="Headlines" />
        <TypeTable group="body" title="Body copy" />
        <TypeTable group="utility" title="Utility and mono text" />
      </div>
    </StyleguideSection>
  );
}
