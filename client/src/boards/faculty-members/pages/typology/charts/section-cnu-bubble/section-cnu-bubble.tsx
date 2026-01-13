import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "highcharts/highcharts-more";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/creat-chart-options";
import { useContextDetection } from "../../../../utils";
import { createBubbleOptions } from "./options";
import { formatToPercent } from "../../../../../../utils/format";
import SubtitleWithContext from "../../../../components/subtitle-with-context";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered fr-mt-3w">
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Effectif total</th>
            <th>Hommes</th>
            <th>Femmes</th>
            <th>% Hommes</th>
            <th>% Femmes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const totalCount = item.totalCount || 0;
            const malePercent =
              totalCount > 0
                ? ((item.maleCount / totalCount) * 100).toFixed(1)
                : "0.0";
            const femalePercent =
              totalCount > 0
                ? ((item.femaleCount / totalCount) * 100).toFixed(1)
                : "0.0";

            return (
              <tr key={index}>
                <td>{item.name || "Non précisé"}</td>
                <td>{totalCount.toLocaleString()}</td>
                <td>{item.maleCount.toLocaleString()}</td>
                <td>{item.femaleCount.toLocaleString()}</td>
                <td>{malePercent}%</td>
                <td>{femalePercent}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SectionsBubbleChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context } = useContextDetection();

  const getContextParams = () => {
    switch (context) {
      case "fields":
        return {
          contextId: searchParams.get("field_id"),
          groupId: searchParams.get("group_id"),
        };
      case "geo":
        return {
          contextId: searchParams.get("geo_id"),
          groupId: searchParams.get("department_id"),
        };
      case "structures":
        return {
          contextId: searchParams.get("structure_id"),
          groupId: searchParams.get("component_id"),
        };
      default:
        return {
          contextId: searchParams.get("field_id"),
          groupId: searchParams.get("group_id"),
        };
    }
  };

  const { contextId, groupId } = getContextParams();

  const { data: cnuData, isLoading } = useFacultyMembersCNU({
    context,
    annee_universitaire: selectedYear,
    contextId: contextId || undefined,
  });

  const getLabels = () => {
    const labels = {
      fields: {
        singular: "discipline",
        plural: "disciplines",
        groupSingular: "groupe CNU",
        groupPlural: "groupes CNU",
        sectionSingular: "section CNU",
        sectionPlural: "sections CNU",
        urlPath: "discipline",
      },
      geo: {
        singular: "région",
        plural: "régions",
        groupSingular: "département",
        groupPlural: "départements",
        sectionSingular: "section",
        sectionPlural: "sections",
        urlPath: "geo",
      },
      structures: {
        singular: "établissement",
        plural: "établissements",
        groupSingular: "composante",
        groupPlural: "composantes",
        sectionSingular: "sous-section",
        sectionPlural: "sous-sections",
        urlPath: "universite",
      },
    };
    return labels[context];
  };

  const labels = getLabels();

  const {
    data: bubbleData,
    sectionCount,
    groupsLegend,
  } = useMemo(() => {
    if (!cnuData) {
      return { data: [], title: "Répartition des effectifs", sectionCount: 0 };
    }

    const safeLabel = (
      ...parts: Array<string | number | undefined | null>
    ): string => {
      const allPresent = parts.every(
        (p) => p !== undefined && p !== null && String(p).trim().length > 0
      );
      return allPresent ? parts.join(" - ") : "Non précisé";
    };

    const safeId = (
      ...parts: Array<string | number | undefined | null>
    ): string => {
      const present = parts
        .filter(
          (p) => p !== undefined && p !== null && String(p).trim().length > 0
        )
        .map((p) => String(p));
      const joined = present.join("_");
      return joined || "";
    };

    type Item = {
      item_id: string;
      itemLabel: string;
      totalCount: number;
      maleCount: number;
      femaleCount: number;
      groupCode?: string;
      groupName?: string;
    };

    let dataToProcess: Item[] = [];
    let totalSections = 0;

    if (groupId && contextId) {
      if (context === "fields") {
        const targetItem = cnuData.cnu_groups_with_sections?.find(
          (item) => item._id.discipline_code === contextId
        );

        if (targetItem) {
          const targetGroup = targetItem.groups?.find(
            (group) => group.group_code === groupId
          );

          if (
            targetGroup &&
            targetGroup.sections &&
            targetGroup.sections.length > 0
          ) {
            totalSections = targetGroup.sections.length;

            const sectionsData: Item[] = [];
            targetGroup.sections.forEach((section) => {
              let maleCount = 0;
              let femaleCount = 0;

              if (section.details) {
                section.details.forEach((detail) => {
                  if (detail.gender === "Masculin") {
                    maleCount += detail.count;
                  } else if (detail.gender === "Féminin") {
                    femaleCount += detail.count;
                  }
                });
              }

              sectionsData.push({
                item_id: safeId(section.section_code),
                itemLabel: safeLabel(
                  section.section_code,
                  section.section_name
                ),
                totalCount: section.section_total || 0,
                maleCount,
                femaleCount,
                groupCode: targetGroup.group_code,
                groupName: targetGroup.group_name,
              } as Item);
            });

            dataToProcess = sectionsData;
          }
        }
      } else if (context === "geo" || context === "structures") {
        if (cnuData.cnu_groups_with_sections) {
          const allSectionsInGroup: Item[] = [];

          cnuData.cnu_groups_with_sections.forEach((discipline) => {
            const targetGroup = discipline.groups?.find(
              (group) => group.group_code === groupId
            );

            if (targetGroup && targetGroup.sections) {
              targetGroup.sections.forEach((section) => {
                let maleCount = 0;
                let femaleCount = 0;

                if (section.details) {
                  section.details.forEach((detail) => {
                    if (detail.gender === "Masculin") {
                      maleCount += detail.count;
                    } else if (detail.gender === "Féminin") {
                      femaleCount += detail.count;
                    }
                  });
                }

                allSectionsInGroup.push({
                  item_id: safeId(
                    discipline._id.discipline_code,
                    section.section_code
                  ),
                  itemLabel: safeLabel(
                    discipline._id.discipline_name,
                    section.section_code,
                    section.section_name
                  ),
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                  groupCode: targetGroup.group_code,
                  groupName: targetGroup.group_name,
                });
              });
            }
          });

          if (allSectionsInGroup.length > 0) {
            totalSections = allSectionsInGroup.length;
            dataToProcess = allSectionsInGroup;
          }
        }
      }
    } else if (contextId) {
      if (context === "fields") {
        const targetItem = cnuData.cnu_groups_with_sections?.find(
          (item) => item._id.discipline_code === contextId
        );

        if (targetItem && targetItem.groups && targetItem.groups.length > 0) {
          const allSections: Array<{
            item_id: string;
            itemLabel: string;
            totalCount: number;
            maleCount: number;
            femaleCount: number;
            groupCode?: string;
            groupName?: string;
          }> = [];

          targetItem.groups.forEach((group) => {
            if (group.sections) {
              group.sections.forEach((section) => {
                let maleCount = 0;
                let femaleCount = 0;

                if (section.details) {
                  section.details.forEach((detail) => {
                    if (detail.gender === "Masculin") {
                      maleCount += detail.count;
                    } else if (detail.gender === "Féminin") {
                      femaleCount += detail.count;
                    }
                  });
                }

                allSections.push({
                  item_id: safeId(section.section_code),
                  itemLabel: safeLabel(
                    section.section_code,
                    section.section_name
                  ),
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                  groupCode: group.group_code,
                  groupName: group.group_name,
                });
              });
            }
          });

          totalSections = allSections.length;
          dataToProcess = allSections;
        }
      } else if (context === "geo" || context === "structures") {
        if (
          cnuData.cnu_groups_with_sections &&
          cnuData.cnu_groups_with_sections.length > 0
        ) {
          const allSections: Array<{
            item_id: string;
            itemLabel: string;
            totalCount: number;
            maleCount: number;
            femaleCount: number;
            groupCode?: string;
            groupName?: string;
          }> = [];

          cnuData.cnu_groups_with_sections.forEach((discipline) => {
            discipline.groups?.forEach((group) => {
              group.sections?.forEach((section) => {
                let maleCount = 0;
                let femaleCount = 0;

                if (section.details) {
                  section.details.forEach((detail) => {
                    if (detail.gender === "Masculin") {
                      maleCount += detail.count;
                    } else if (detail.gender === "Féminin") {
                      femaleCount += detail.count;
                    }
                  });
                }

                allSections.push({
                  item_id: safeId(
                    discipline._id.discipline_code,
                    group.group_code,
                    section.section_code
                  ),
                  itemLabel: safeLabel(
                    discipline._id.discipline_name,
                    group.group_name,
                    section.section_name
                  ),
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                  groupCode: group.group_code,
                  groupName: group.group_name,
                });
              });
            });
          });

          totalSections = allSections.length;
          dataToProcess = allSections;
        }
      }
    } else {
      const allSections: Array<{
        item_id: string;
        itemLabel: string;
        totalCount: number;
        maleCount: number;
        femaleCount: number;
        groupCode?: string;
        groupName?: string;
      }> = [];

      if (
        cnuData.cnu_groups_with_sections &&
        cnuData.cnu_groups_with_sections.length > 0
      ) {
        cnuData.cnu_groups_with_sections.forEach((discipline) => {
          discipline.groups?.forEach((group) => {
            group.sections?.forEach((section) => {
              let maleCount = 0;
              let femaleCount = 0;

              if (section.details) {
                section.details.forEach((detail) => {
                  if (detail.gender === "Masculin") {
                    maleCount += detail.count;
                  } else if (detail.gender === "Féminin") {
                    femaleCount += detail.count;
                  }
                });
              }

              allSections.push({
                item_id: safeId(section.section_code),
                itemLabel: safeLabel(
                  section.section_code,
                  section.section_name
                ),
                totalCount: section.section_total || 0,
                maleCount,
                femaleCount,
                groupCode: group.group_code,
                groupName: group.group_name,
              });
            });
          });
        });

        totalSections = allSections.length;
        dataToProcess = allSections;
      }
    }

    const getDsfrScaleVarNames = (count: number) =>
      Array.from({ length: count }, (_, i) => `--scale-${i + 1}-color`);

    const resolveCssVarColors = (varNames: string[]): string[] => {
      if (typeof window === "undefined") return [];
      const el = document.createElement("div");
      el.style.display = "none";
      document.body.appendChild(el);
      const resolved: string[] = [];
      try {
        varNames.forEach((v) => {
          el.style.color = `var(${v})`;
          const col = getComputedStyle(el).color;
          if (col && col !== "rgba(0, 0, 0, 0)" && col !== "inherit") {
            resolved.push(col);
          }
        });
      } finally {
        document.body.removeChild(el);
      }
      return resolved;
    };

    const dsfrVarNames = getDsfrScaleVarNames(20);
    const dsfrColors = resolveCssVarColors(dsfrVarNames);
    const fallbackPalette = [
      "var(--scale-1-color)",
      "var(--scale-2-color)",
      "var(--scale-3-color)",
      "var(--scale-4-color)",
      "var(--scale-5-color)",
      "var(--scale-6-color)",
      "var(--scale-7-color)",
      "var(--scale-8-color)",
      "var(--scale-9-color)",
      "var(--scale-10-color)",
      "var(--scale-11-color)",
      "var(--scale-12-color)",
      "var(--scale-13-color)",
      "var(--scale-14-color)",
      "var(--scale-15-color)",
    ];
    const palette = dsfrColors.length > 0 ? dsfrColors : fallbackPalette;

    const filteredItems = dataToProcess.filter(
      (d) => d.itemLabel !== "Non précisé"
    );

    const uniqGroupCodes = Array.from(
      new Set(
        filteredItems.map((d) => (d.groupCode ? String(d.groupCode) : "autre"))
      )
    );
    const groupColorMap: Record<string, string> = {};
    uniqGroupCodes.forEach((code, idx) => {
      groupColorMap[code] = palette[idx % palette.length];
    });

    const processedData = filteredItems.map((item) => {
      const colorKey = item.groupCode ? String(item.groupCode) : "autre";
      return {
        x: item.femaleCount,
        y: item.maleCount,
        z: item.totalCount,
        name: item.itemLabel,
        color: groupColorMap[colorKey],
        maleCount: item.maleCount,
        femaleCount: item.femaleCount,
        totalCount: item.totalCount,
        sectionCode: item.item_id,
        groupCode: item.groupCode,
        groupName: item.groupName,
      };
    });

    processedData.sort((a, b) => b.z - a.z);

    const groupsLegend = uniqGroupCodes
      .map((code) => {
        const item = filteredItems.find((d) => String(d.groupCode) === code);
        return {
          code,
          name: item?.groupName || "Autre",
          color: groupColorMap[code],
        };
      })
      .sort((a, b) => a.code.localeCompare(b.code));

    void totalSections;
    return {
      data: processedData,
      sectionCount: filteredItems.length,
      groupsLegend,
    };
  }, [cnuData, contextId, groupId, context]);
  const config = {
    id: `${context}-sections-bubbles`,
    idQuery: `faculty-members-cnu`,
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h2" as const,
      fr: (
        <>
          Équilibre de la répartition Homme / Femme par section CNU
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          <div className="fr-text--xs fr-mt-2w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-8">
                <div className="fr-text--center">
                  Chaque couleur représente un groupe CNU. Les points d'une même
                  couleur appartiennent au même groupe. Les points représentent
                  les sections CNU, positionnées en fonction de leur effectif
                  féminin (axe des X) et masculin (axe des Y).
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-text--center">
                  <em>Taille des bulles = effectif total</em>
                </div>
              </div>
            </div>

            <div className="fr-text--center fr-mt-2w">
              📍 La ligne diagonale pointillée représente la parité parfaite
              <br />• Au-dessus : plus d'hommes • En-dessous : plus de femmes
            </div>

            {groupsLegend && groupsLegend.length > 0 && (
              <div className="fr-mt-3w">
                <div className="fr-text--bold fr-text--center fr-mb-1w">
                  Groupes CNU
                </div>
                <div
                  className="fr-grid-row fr-grid-row--gutters"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {groupsLegend.map((group) => (
                    <div
                      key={group.code}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#f6f6f6",
                        borderRadius: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          backgroundColor: group.color,
                          borderRadius: "50%",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "0.75rem" }}>
                        {group.code} - {group.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          Seul les enseignants permanents sont pris en compte dans cette
          analyse.
        </>
      ),
    },
    source: {
      label: {
        fr: <>MESR-SIES, SISE</>,
        en: <>MESR-SIES, SISE</>,
      },
      url: {
        fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
        en: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
      },
    },
    updateDate: new Date(),
    integrationURL: `/personnel-enseignant/${labels.urlPath}/typologie`,
  };

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-mb-2w">
          <span
            className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
            aria-hidden="true"
          ></span>
        </div>
        <div>Chargement des données des {labels.sectionPlural}...</div>
      </div>
    );
  }

  if (!bubbleData || bubbleData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>
            Aucune {labels.sectionSingular} disponible pour {selectedYear}
            {contextId && " et la sélection effectuée"}
          </p>
        </div>
      </div>
    );
  }

  if (sectionCount === 1) {
    const singleSection = bubbleData[0];
    const femalePercent =
      singleSection.totalCount > 0
        ? Math.round(
            (singleSection.femaleCount / singleSection.totalCount) * 100
          )
        : 0;
    const malePercent = 100 - femalePercent;

    return (
      <div className="fr-py-4w">
        <div className="fr-alert fr-alert--info">
          <h3 className="fr-alert__title">
            {labels.sectionSingular.charAt(0).toUpperCase() +
              labels.sectionSingular.slice(1)}{" "}
            unique
          </h3>
          <p>
            {groupId
              ? `Ce ${labels.groupSingular} ne contient qu'une seule ${labels.sectionSingular}`
              : `Cette sélection ne contient qu'une seule ${labels.sectionSingular}`}{" "}
            : <strong>{singleSection.name}</strong>
          </p>
          <div className="fr-mt-3w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Effectif total</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleSection.totalCount.toLocaleString()}
                        </strong>{" "}
                        enseignants
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Hommes</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleSection.maleCount.toLocaleString()}
                        </strong>{" "}
                        ({malePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Femmes</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>
                          {singleSection.femaleCount.toLocaleString()}
                        </strong>{" "}
                        ({formatToPercent(femalePercent)})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...bubbleData.map((d) => Math.max(d.x, d.y)));
  const padding = maxValue * 0.1;

  const bubbleOptions = CreateChartOptions(
    "bubble",
    createBubbleOptions({
      bubbleData,
      maxValue,
      padding,
    })
  );

  return (
    <>
      <ChartWrapper config={config} options={bubbleOptions} renderData={() => <RenderData data={bubbleData} />} />
    </>
  );
}

export default SectionsBubbleChart;
