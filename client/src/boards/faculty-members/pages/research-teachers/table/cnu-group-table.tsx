import { Badge } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { formatToPercent } from "../../../../../utils/format";

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

  const hasStructuresContext =
    Array.isArray(researchTeachersData?.structures) &&
    researchTeachersData.structures.length > 0;
  const hasFieldsContext =
    Array.isArray(researchTeachersData?.fields) &&
    researchTeachersData.fields.length > 0;

  if (cnuGroups.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucun groupe CNU disponible pour ce contexte.</p>
      </div>
    );
  }

  const getAgeData = (group, ageClass) => {
    if (Array.isArray(group.ageDistribution)) {
      return group.ageDistribution.find((age) => age.ageClass === ageClass);
    }

    if (group.age_distribution && Array.isArray(group.age_distribution)) {
      return group.age_distribution.find(
        (age) => age.ageClass === ageClass || age._id === ageClass
      );
    }

    return null;
  };

  return (
    <div>
      {hasStructuresContext && (
        <div className="fr-mb-2w fr-text--bold">
          {`Établissement : ${researchTeachersData.structures[0].structureName}`}
        </div>
      )}

      {hasFieldsContext && (
        <div className="fr-mb-2w fr-text--bold">
          {`Discipline : ${researchTeachersData.fields[0].fieldLabel}`}
        </div>
      )}

      <table className="fr-table fr-table--bordered fr-table--sm">
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
                <th scope="col" className="text-center">
                  Non précisé
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {cnuGroups.map((group) => {
            const groupTotalCount = group.totalCount || 0;
            const groupMaleCount = group.maleCount || 0;
            const groupFemaleCount = group.femaleCount || 0;

            const malePercent =
              groupTotalCount > 0
                ? Math.round((groupMaleCount / groupTotalCount) * 100)
                : 0;
            const femalePercent = 100 - malePercent;

            const younger35 = getAgeData(group, "35 ans et moins");
            const middle36_55 = getAgeData(group, "36 à 55 ans");
            const older56 = getAgeData(group, "56 ans et plus");
            const unspecified = getAgeData(group, "Non précisé");

            return (
              <tr key={group.cnuGroupId}>
                <td>
                  <strong>{group.cnuGroupLabel}</strong>
                  <br />
                  <small className="text-grey">{group.cnuGroupId}</small>
                </td>
                <td className="text-center">
                  {groupMaleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {groupFemaleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {groupTotalCount.toLocaleString()}
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
                      {formatToPercent(malePercent)} /{" "}
                      {formatToPercent(femalePercent)}
                    </Badge>
                  </small>
                </td>
                {showAgeDemographics && (
                  <>
                    <td className="text-center">
                      {younger35
                        ? (younger35.count || younger35.y || 0).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      {middle36_55
                        ? (
                            middle36_55.count ||
                            middle36_55.y ||
                            0
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      {older56
                        ? (older56.count || older56.y || 0).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      {unspecified
                        ? (
                            unspecified.count ||
                            unspecified.y ||
                            0
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
