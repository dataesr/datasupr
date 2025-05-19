import { Link } from "@dataesr/dsfr-plus";

interface CnuSection {
  cnuGroupId: string | number;
  cnuSectionId: string | number;
  fieldId?: string | number;
  fieldLabel?: string;
  cnuGroupLabel: string;
  cnuSectionLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  ageDistribution?: Array<{
    ageClass: string;
    count: number;
    percent: number;
  }>;
}

type CnuSectionsTableProps = {
  cnuSections: Array<CnuSection>;
  showDiscipline?: boolean;
  showGroup?: boolean;
  showAgeDemographics?: boolean;
};

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
          const malePercent = Math.round(
            (section.maleCount / section.totalCount) * 100
          );
          const femalePercent = 100 - malePercent;

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
            <tr key={`${section.cnuGroupId}-${section.cnuSectionId}`}>
              {showDiscipline && (
                <td>
                  <Link
                    href={`/personnel-enseignant/discipline/enseignants-chercheurs/${section.fieldId}`}
                  >
                    <strong>{section.fieldLabel}</strong>
                  </Link>
                </td>
              )}
              {showGroup && (
                <td>
                  <strong>{section.cnuGroupLabel}</strong>
                </td>
              )}
              <td>
                <strong>{section.cnuSectionLabel}</strong>
                <br />
                <small className="text-grey">{section.cnuSectionId}</small>
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
                  {malePercent}% / {femalePercent}%
                </small>
              </td>
              {showAgeDemographics && section.ageDistribution && (
                <>
                  <td className="text-center">
                    {younger35?.count.toLocaleString()}
                    <br />
                    <small>{younger35?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {middle36_55?.count.toLocaleString()}
                    <br />
                    <small>{middle36_55?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {older56?.count.toLocaleString()}
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
