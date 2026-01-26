import { Badge } from "@dataesr/dsfr-plus";
import { useMemo } from "react";

import { CnuGroup, CnuGroupsTableProps } from "../../../../../types/faculty-members";
import { formatToPercent } from "../../../../../utils/format";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { TrendIndicator } from "./tendances";

import "./styles.scss";


export default function CnuGroupsTable({
  context,
  contextId,
  annee_universitaire,
  showAgeDemographics = false,
}: CnuGroupsTableProps) {
  const {
    data: currentYearData,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useFacultyMembersResearchTeachers({
    context,
    contextId,
    annee_universitaire,
  });

  const previousYear = annee_universitaire
    ? `${parseInt(annee_universitaire.split("-")[0]) - 1}-${
        parseInt(annee_universitaire.split("-")[1]) - 1
      }`
    : undefined;

  const {
    data: previousYearData,
    isLoading: isLoadingPrevious,
    error: errorPrevious,
  } = useFacultyMembersResearchTeachers({
    context,
    contextId,
    annee_universitaire: previousYear,
  });

  const cnuGroups = useMemo(
    () => currentYearData?.cnuGroups || [],
    [currentYearData]
  );

  const allCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        cnuGroups.flatMap((group) =>
          (group.categories || []).map((cat) => cat.categoryName)
        )
      )
    ).filter(Boolean);

    const desiredOrder = [
      "Maître de conférences et assimilés",
      "Professeur et assimilés",
      "enseignants du 2nd degré",
    ];

    uniqueCategories.sort((a, b) => {
      const indexA = desiredOrder.indexOf(String(a));
      const indexB = desiredOrder.indexOf(String(b));

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) {
        return -1;
      }
      if (indexB !== -1) {
        return 1;
      }
      return String(a).localeCompare(String(b));
    });

    return uniqueCategories;
  }, [cnuGroups]);

  const processedCnuGroups = useMemo(() => {
    if (!cnuGroups) return [];
    const prevGroupsMap = new Map<string, CnuGroup>(
      (previousYearData?.cnuGroups as CnuGroup[] | undefined)?.map((g) => [
        g.cnuGroupId,
        g,
      ]) ?? []
    );

    return cnuGroups.map((group: CnuGroup) => {
      const prevGroup = prevGroupsMap.get(group.cnuGroupId);
      const categoriesWithTrend = allCategories.map((cat) => {
        const currentCat = group.categories?.find(
          (c) => c.categoryName === cat
        );
        const prevCat = prevGroup?.categories?.find(
          (c) => c.categoryName === cat
        );
        const currentCount = currentCat?.count || 0;
        const prevCount = prevCat?.count || 0;
        const trend = currentCount - prevCount;
        return {
          name: cat,
          count: currentCount,
          trend: trend,
        };
      });
      return {
        ...group,
        categoriesWithTrend,
      };
    });
  }, [cnuGroups, previousYearData, allCategories]);

  const isLoading = isLoadingCurrent || isLoadingPrevious;
  const error = errorCurrent || errorPrevious;

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

  if (cnuGroups.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucun groupe CNU disponible pour ce contexte.</p>
      </div>
    );
  }

  return (
    <div className="cnu-table-root">
      <div className="cnu-table-scroll">
        <table className="fr-table fr-table--bordered fr-table--no-caption cnu-table">
          <thead className="cnu-table__head">
            <tr>
              <th scope="col" className="th--label">
                Groupe CNU
              </th>
              <th scope="col" className="text-center th--min60">
                Hommes
              </th>
              <th scope="col" className="text-center th--min60">
                Femmes
              </th>
              <th scope="col" className="text-center th--min60">
                Total
              </th>
              <th scope="col" className="text-center th--min140">
                Répartition H/F
              </th>
              {showAgeDemographics && (
                <th scope="col" className="text-center th--min140">
                  Répartition par âge
                  <div className="age-legend">
                    <span title="≤ 35 ans">
                      <span className="legend-color age-35" /> ≤35
                    </span>
                    <span title="36-55 ans">
                      <span className="legend-color age-36-55" /> 36-55
                    </span>
                    <span title="≥ 56 ans">
                      <span className="legend-color age-56" /> ≥56
                    </span>
                    <span title="Non précisé">
                      <span className="legend-color age-np" /> NP
                    </span>
                  </div>
                </th>
              )}
              {allCategories.map((cat) => (
                <th
                  key={String(cat)}
                  scope="col"
                  className="text-center th--min80"
                >
                  {String(cat)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedCnuGroups.map((group) => {
              const groupTotalCount = group.totalCount || 0;
              const groupMaleCount = group.maleCount || 0;
              const groupFemaleCount = group.femaleCount || 0;

              const malePercent =
                groupTotalCount > 0
                  ? Math.round((groupMaleCount / groupTotalCount) * 100)
                  : 0;
              const femalePercent = 100 - malePercent;

              const younger35 = group.ageDistribution?.find(
                (age) => age.ageClass === "35 ans et moins"
              );
              const middle36_55 = group.ageDistribution?.find(
                (age) => age.ageClass === "36 à 55 ans"
              );
              const older56 = group.ageDistribution?.find(
                (age) => age.ageClass === "56 ans et plus"
              );
              const unspecifiedAge = group.ageDistribution?.find(
                (age) => age.ageClass === "Non précisé"
              );

              const totalForAge =
                (younger35?.count || 0) +
                  (middle36_55?.count || 0) +
                  (older56?.count || 0) +
                  (unspecifiedAge?.count || 0) || 1;

              const p35 = Math.round(
                ((younger35?.count || 0) / totalForAge) * 100
              );
              const p36_55 = Math.round(
                ((middle36_55?.count || 0) / totalForAge) * 100
              );
              const p56 = Math.round(
                ((older56?.count || 0) / totalForAge) * 100
              );
              let pUnspecified = 100 - (p35 + p36_55 + p56);
              if (pUnspecified < 0) pUnspecified = 0;

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
                  <td className="text-center nowrap">
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
                    <Badge>
                      {formatToPercent(malePercent)} /{" "}
                      {formatToPercent(femalePercent)}
                    </Badge>
                  </td>
                  {showAgeDemographics && (
                    <td className="text-center">
                      <div
                        className="age-bars"
                        aria-label="Répartition par âge"
                      >
                        <span
                          className="age-segment age-35"
                          title={`≤ 35 ans: ${
                            younger35?.count.toLocaleString() || 0
                          }`}
                          style={{ width: `${p35}%` }}
                        />
                        <span
                          className="age-segment age-36-55"
                          title={`36-55 ans: ${
                            middle36_55?.count.toLocaleString() || 0
                          }`}
                          style={{ width: `${p36_55}%` }}
                        />
                        <span
                          className="age-segment age-56"
                          title={`≥ 56 ans: ${
                            older56?.count.toLocaleString() || 0
                          }`}
                          style={{ width: `${p56}%` }}
                        />
                        {pUnspecified > 0 && (
                          <span
                            className="age-segment age-np"
                            title={`Non précisé: ${
                              unspecifiedAge?.count.toLocaleString() || 0
                            }`}
                            style={{ width: `${pUnspecified}%` }}
                          />
                        )}
                      </div>
                    </td>
                  )}
                  {group.categoriesWithTrend.map((cat) => (
                    <td key={String(cat.name)} className="text-center">
                      {cat.count.toLocaleString()}
                      {previousYearData && <TrendIndicator trend={cat.trend} />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
