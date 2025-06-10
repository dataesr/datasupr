import { Badge } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";

interface CnuGroupsTableProps {
  context: "fields" | "geo" | "structures";
  contextId: string;
  annee_universitaire?: string;
  showAgeDemographics?: boolean;
}

export default function CnuGroupsTable({
  context,
  contextId,
  annee_universitaire,
  showAgeDemographics = false,
}: CnuGroupsTableProps) {
  const {
    data: researchTeachersData,
    isLoading,
    error,
  } = useFacultyMembersResearchTeachers({
    context,
    contextId,
    annee_universitaire,
  });

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des groupes CNU...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-alert fr-alert--error">
        <p>Erreur lors du chargement des groupes CNU : {error.message}</p>
      </div>
    );
  }

  const cnuGroups = researchTeachersData?.cnuGroups || [];

  if (cnuGroups.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucun groupe CNU disponible pour ce contexte.</p>
      </div>
    );
  }

  return (
    <table className="fr-table fr-table--bordered">
      <thead>
        <tr>
          <th scope="col">Groupe CNU</th>
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
        {cnuGroups.map((group) => {
          const malePercent =
            group.totalCount > 0
              ? Math.round((group.maleCount / group.totalCount) * 100)
              : 0;
          const femalePercent = 100 - malePercent;

          return (
            <tr key={group.cnuGroupId}>
              <td>
                <strong>{group.cnuGroupLabel}</strong>
                <br />
                <small className="text-grey">{group.cnuGroupId}</small>
              </td>
              <td className="text-center">
                {group.maleCount.toLocaleString()}
              </td>
              <td className="text-center">
                {group.femaleCount.toLocaleString()}
              </td>
              <td className="text-center">
                {group.totalCount.toLocaleString()}
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
                  <td className="text-center">N/A</td>
                  <td className="text-center">N/A</td>
                  <td className="text-center">N/A</td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
