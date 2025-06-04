import { Link } from "@dataesr/dsfr-plus";
import { CnuSectionsTableProps } from "../types";

export default function CnuSectionsTable({
  cnuSections,
  showDiscipline = false,
  showGroup = false,
  showAgeDemographics = true,
}: CnuSectionsTableProps) {
  return (
    <table className="fr-table fr-table--bordered">
      <thead>
        <tr>
          {showDiscipline && <th scope="col">Discipline</th>}
          {showGroup && <th scope="col">Groupe CNU</th>}
          <th scope="col">Section CNU</th>
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
          {showAgeDemographics && (
            <>
              <th scope="col" className="text-center">
                ≤ 35 ans
              </th>
              <th scope="col" className="text-center">
                36-55 ans
              </th>
              <th scope="col" className="text-center">
                ≥ 56 ans
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {cnuSections.map((section) => {
          const maleCount = section.maleCount ?? section.numberMan ?? 0;
          const femaleCount = section.femaleCount ?? section.numberWoman ?? 0;
          const totalCount = section.totalCount ?? maleCount + femaleCount;
          const sectionId =
            section.cnuSectionId ?? section.cnu_section_id ?? "";
          const sectionLabel =
            section.cnuSectionLabel ?? section.cnu_section_label ?? "";
          const groupId = section.cnuGroupId ?? "";
          const groupLabel = section.cnuGroupLabel ?? "";
          const field_id = section.field_id ?? "";
          const fieldLabel = section.fieldLabel ?? "";

          const malePercent =
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
          const femalePercent = 100 - malePercent;

          // Recherche des tranches d'âge
          const younger35 = section.ageDistribution?.find(
            (age) => age.ageClass === "35 ans et moins"
          );
          const middle36_55 = section.ageDistribution?.find(
            (age) => age.ageClass === "36 à 55 ans"
          );
          const older56 = section.ageDistribution?.find(
            (age) => age.ageClass === "56 ans et plus"
          );

          return (
            <tr key={`${groupId}-${sectionId}`}>
              {showDiscipline && (
                <td>
                  <Link
                    href={`/personnel-enseignant/discipline/enseignants-chercheurs/${field_id}`}
                  >
                    <strong>{fieldLabel}</strong>
                  </Link>
                </td>
              )}
              {showGroup && (
                <td>
                  <strong>{groupLabel}</strong>
                </td>
              )}
              <td>
                <strong>{sectionLabel}</strong>
                <br />
                <small className="text-grey">{sectionId}</small>
              </td>
              <td className="text-center">{maleCount.toLocaleString()}</td>
              <td className="text-center">{femaleCount.toLocaleString()}</td>
              <td className="text-center">{totalCount.toLocaleString()}</td>
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
                  {malePercent}% / {femalePercent}%
                </small>
              </td>
              {showAgeDemographics && section.ageDistribution && (
                <>
                  <td className="text-center">
                    {younger35?.count.toLocaleString() || "N/A"}
                    <br />
                    <small>{younger35?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {middle36_55?.count.toLocaleString() || "N/A"}
                    <br />
                    <small>{middle36_55?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {older56?.count.toLocaleString() || "N/A"}
                    <br />
                    <small>{older56?.percent}%</small>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
