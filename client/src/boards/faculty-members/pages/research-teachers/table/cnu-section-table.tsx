import { Badge, Accordion, AccordionGroup } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { useMemo } from "react";
import { formatToPercent } from "../../../../../utils/format";
import { TrendIndicator } from "./tendances";

function groupBy<T, K extends string>(array: T[], getKey: (item: T) => K) {
  return array.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc = { ...acc, [key]: [] };
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export default function CnuSectionsTable({
  context,
  contextId,
  annee_universitaire,
  showDiscipline = false,
  showAgeDemographics = true,
}) {
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

  const cnuSections = useMemo(() => {
    if (!currentYearData?.cnuGroups) return [];
    return currentYearData.cnuGroups.flatMap((group) =>
      (group.cnuSections || []).map((section) => ({
        ...section,
        cnuGroupId: group.cnuGroupId,
        cnuGroupLabel: group.cnuGroupLabel,
      }))
    );
  }, [currentYearData]);

  const allCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        cnuSections.flatMap((section) =>
          (section.categories || []).map((cat) => cat.categoryName)
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
  }, [cnuSections]);

  const processedCnuSections = useMemo(() => {
    if (!cnuSections) return [];
    const prevSectionsFlat =
      previousYearData?.cnuGroups?.flatMap(
        (group) => group.cnuSections || []
      ) || [];
    type SectionType = (typeof cnuSections)[number];
    const prevSectionsMap = new Map<string, SectionType>(
      prevSectionsFlat.map((s) => [s.cnuSectionId, s as SectionType])
    );

    return cnuSections.map((section) => {
      const prevSection = prevSectionsMap.get(section.cnuSectionId);
      const categoriesWithTrend = allCategories.map((cat) => {
        const currentCat = section.categories?.find(
          (c) => c.categoryName === cat
        );
        const prevCat = prevSection?.categories?.find(
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
        ...section,
        categoriesWithTrend,
      };
    });
  }, [cnuSections, previousYearData, allCategories]);

  const isLoading = isLoadingCurrent || isLoadingPrevious;
  const error = errorCurrent || errorPrevious;

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

  const groupedByGroup = groupBy(
    processedCnuSections,
    (section: (typeof processedCnuSections)[number]) =>
      `${section.cnuGroupId} - ${section.cnuGroupLabel}`
  );

  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      <AccordionGroup>
        {Object.entries(groupedByGroup).map(([groupKey, sections]) => (
          <Accordion
            key={groupKey}
            title={groupKey}
            titleAs="h4"
            defaultExpanded={false}
          >
            <div
              style={{
                overflowX: "auto",
                maxHeight: "400px",
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
                    {showDiscipline && (
                      <th scope="col" style={{ fontSize: "0.85em" }}>
                        Discipline
                      </th>
                    )}
                    <th scope="col" style={{ fontSize: "0.85em" }}>
                      Section CNU
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
                        key={String(cat)}
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
                  {sections.map((section) => {
                    const malePercent =
                      section.totalCount > 0
                        ? Math.round(
                            (section.maleCount / section.totalCount) * 100
                          )
                        : 0;
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
                    const unspecifiedAge = section.ageDistribution?.find(
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
                      <tr key={section.cnuSectionId}>
                        {showDiscipline && (
                          <td>
                            <strong>{section.disciplineLabel}</strong>
                          </td>
                        )}
                        <td>
                          <strong>
                            {section.cnuSectionLabel} - {section.cnuSectionId}
                          </strong>
                        </td>
                        <td className="text-center">
                          {section.maleCount.toLocaleString()}
                        </td>
                        <td className="text-center">
                          {section.femaleCount.toLocaleString()}
                        </td>
                        <td className="text-center">
                          {section.totalCount?.toLocaleString()}
                        </td>
                        <td
                          className="text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {" "}
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
                        {section.categoriesWithTrend.map((cat) => (
                          <td key={String(cat.name)} className="text-center">
                            {cat.count.toLocaleString()}
                            {previousYearData && (
                              <TrendIndicator trend={cat.trend} />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Accordion>
        ))}
      </AccordionGroup>
    </div>
  );
}
