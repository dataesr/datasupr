import { Title, Link, Badge } from "@dataesr/dsfr-plus";
import { CNUSection } from "../../../types";

interface CnuSectionsTableProps {
  cnuSections: CNUSection[];
  maxDisplay?: number;
}

export default function CnuSectionsTable({
  cnuSections,
  maxDisplay = 30,
}: CnuSectionsTableProps) {
  if (!cnuSections.length) {
    return <p>Aucune donnée disponible pour les sections CNU</p>;
  }

  return (
    <>
      <Title as="h4" look="h6">
        {maxDisplay < cnuSections.length
          ? `Top ${maxDisplay} des sections CNU par effectif`
          : "Sections CNU par effectif"}
      </Title>
      <table className="fr-table">
        <thead>
          <tr>
            <th scope="col">Section CNU</th>
            <th scope="col">Groupe CNU</th>
            <th scope="col">Discipline</th>
            <th scope="col" className="text-center">
              Hommes
            </th>
            <th scope="col" className="text-center">
              Femmes
            </th>
            <th scope="col" className="text-center">
              Total
            </th>
            <th scope="col" className="text-center">
              Répartition H/F
            </th>
          </tr>
        </thead>
        <tbody>
          {cnuSections.slice(0, maxDisplay).map((section) => {
            const malePercent = Math.round(
              (section.maleCount / section.totalCount) * 100
            );
            const femalePercent = 100 - malePercent;

            return (
              <tr key={`${section.cnuGroupId}-${section.cnuSectionId}`}>
                <td>
                  <strong>{section.cnuSectionLabel}</strong>
                  <br />
                  <small className="text-grey">
                    Section {section.cnuSectionId}
                  </small>
                </td>
                <td>{section.cnuGroupLabel}</td>
                <td>
                  <Link
                    href={`/personnel-enseignant/discipline/vue-d'ensemble/${section.fieldId}`}
                  >
                    {section.fieldLabel}
                  </Link>
                </td>
                <td className="text-center">
                  {section.maleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {section.femaleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {section.totalCount.toLocaleString()}
                </td>
                <td className="text-center">
                  <div className="progress-container">
                    <div
                      className="progress-bar male"
                      style={{ width: `${malePercent}%` }}
                    ></div>
                    <div
                      className="progress-bar female"
                      style={{ width: `${femalePercent}%` }}
                    ></div>
                  </div>
                  <small>
                    <Badge>
                      {malePercent}% / {femalePercent}%
                    </Badge>
                  </small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
