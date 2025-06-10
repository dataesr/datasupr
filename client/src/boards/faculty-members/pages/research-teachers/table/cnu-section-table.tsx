import { Badge, Link } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { useMemo } from "react";

interface CnuSectionsTableProps {
  context: "fields" | "geo" | "structures";
  contextId: string;
  annee_universitaire?: string;
  showDiscipline?: boolean;
  showGroup?: boolean;
  showAgeDemographics?: boolean;
}

export default function CnuSectionsTable({
  context,
  contextId,
  annee_universitaire,
  showDiscipline = false,
  showGroup = false,
  showAgeDemographics = true,
}: CnuSectionsTableProps) {
  const {
    data: researchTeachersData,
    isLoading,
    error,
  } = useFacultyMembersResearchTeachers({
    context,
    contextId,
    annee_universitaire,
  });

  const cnuSections = useMemo(() => {
    if (!researchTeachersData?.cnuGroups) return [];

    return researchTeachersData.cnuGroups.flatMap((group) =>
      (group.cnuSections || []).map((section) => ({
        ...section,
        cnuGroupId: group.cnuGroupId,
        cnuGroupLabel: group.cnuGroupLabel,
      }))
    );
  }, [researchTeachersData]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des sections CNU...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-alert fr-alert--error">
        <p>Erreur lors du chargement des sections CNU : {error.message}</p>
      </div>
    );
  }

  if (cnuSections.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune section CNU disponible pour ce contexte.</p>
      </div>
    );
  }

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
          const malePercent =
            section.totalCount > 0
              ? Math.round((section.maleCount / section.totalCount) * 100)
              : 0;
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
            <tr key={`${section.cnuGroupId}-${section.cnuSectionId}`}>
              {showDiscipline && (
                <td>
                  <Link
                    href={`/personnel-enseignant/discipline/enseignants-chercheurs/${contextId}`}
                  >
                    <strong>{researchTeachersData?.fieldLabel}</strong>
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
                  <Badge>
                    {malePercent}% / {femalePercent}%
                  </Badge>
                </small>
              </td>
              {showAgeDemographics && (
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
