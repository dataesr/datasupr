import { Badge } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { formatToPercent } from "../../../../../utils/format";
import { useMemo } from "react";

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

  const cnuGroups = useMemo(
    () => researchTeachersData?.cnuGroups || [],
    [researchTeachersData]
  );

  const allCategories = useMemo(() => {
    return Array.from(
      new Set(
        cnuGroups.flatMap((group) =>
          (group.categories || []).map((cat) => cat.categoryName)
        )
      )
    ).filter(Boolean);
  }, [cnuGroups]);

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
    <div style={{ width: "100%", maxWidth: "100%" }}>
      <div
        style={{
          overflowX: "auto",
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        <table
          className="fr-table fr-table--bordered fr-table--no-caption"
          style={{
            width: "100%",
            fontSize: "0.9em",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--background-default-grey)",
              zIndex: 1,
            }}
          >
            <tr>
              <th scope="col" style={{ fontSize: "0.85em" }}>
                Groupe CNU
              </th>
              <th
                scope="col"
                className="text-center"
                style={{ minWidth: "60px", fontSize: "0.85em" }}
              >
                Hommes
              </th>
              <th
                scope="col"
                className="text-center"
                style={{ minWidth: "60px", fontSize: "0.85em" }}
              >
                Femmes
              </th>
              <th
                scope="col"
                className="text-center"
                style={{ minWidth: "60px", fontSize: "0.85em" }}
              >
                Total
              </th>
              <th
                scope="col"
                className="text-center"
                style={{ minWidth: "140px", fontSize: "0.85em" }}
              >
                Répartition H/F
              </th>
              {showAgeDemographics && (
                <th
                  scope="col"
                  className="text-center"
                  style={{ minWidth: "140px", fontSize: "0.85em" }}
                >
                  Répartition par âge
                  <div
                    style={{
                      fontSize: "0.8em",
                      marginTop: 4,
                      display: "flex",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <span title="≤ 35 ans">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 8,
                          background: "#6CB4E4",
                          borderRadius: 2,
                          marginRight: 2,
                          verticalAlign: "middle",
                        }}
                      />{" "}
                      ≤35
                    </span>
                    <span title="36-55 ans">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 8,
                          background: "#F5C16C",
                          borderRadius: 2,
                          marginRight: 2,
                          verticalAlign: "middle",
                        }}
                      />{" "}
                      36-55
                    </span>
                    <span title="≥ 56 ans">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 8,
                          background: "#E18B76",
                          borderRadius: 2,
                          marginRight: 2,
                          verticalAlign: "middle",
                        }}
                      />{" "}
                      ≥56
                    </span>
                    <span title="Non précisé">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 8,
                          background: "#CCCCCC",
                          borderRadius: 2,
                          marginRight: 2,
                          verticalAlign: "middle",
                        }}
                      />{" "}
                      NP
                    </span>
                  </div>
                </th>
              )}
              {allCategories.map((cat) => (
                <th
                  scope="col"
                  className="text-center"
                  style={{ minWidth: "80px", fontSize: "0.85em" }}
                >
                  {String(cat)}
                </th>
              ))}
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
                  <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                    <div
                      className="progress-container"
                      style={{ minWidth: "60px", margin: "0 auto" }}
                    >
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
                        style={{
                          display: "flex",
                          height: "18px",
                          width: "100%",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #ddd",
                          margin: "0 auto",
                        }}
                        aria-label="Répartition par âge"
                      >
                        <div
                          title={`≤ 35 ans: ${
                            younger35?.count.toLocaleString() || 0
                          }`}
                          style={{
                            background: "#6CB4E4",
                            width: `${p35}%`,
                          }}
                        />
                        <div
                          title={`36-55 ans: ${
                            middle36_55?.count.toLocaleString() || 0
                          }`}
                          style={{
                            background: "#F5C16C",
                            width: `${p36_55}%`,
                          }}
                        />
                        <div
                          title={`≥ 56 ans: ${
                            older56?.count.toLocaleString() || 0
                          }`}
                          style={{
                            background: "#E18B76",
                            width: `${p56}%`,
                          }}
                        />
                        {pUnspecified > 0 && (
                          <div
                            title={`Non précisé: ${
                              unspecifiedAge?.count.toLocaleString() || 0
                            }`}
                            style={{
                              background: "#CCCCCC",
                              width: `${pUnspecified}%`,
                            }}
                          />
                        )}
                      </div>
                    </td>
                  )}
                  {allCategories.map((cat) => {
                    const found = group.categories?.find(
                      (c) => c.categoryName === cat
                    );
                    return (
                      <td className="text-center">
                        {found ? found.count.toLocaleString() : 0}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
