import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/creat-chart-options";
import { useContextDetection } from "../../../../utils";
import { createBubbleOptions } from "./options";
import { formatToPercent } from "../../../../../../utils/format";

HighchartsMore(Highcharts);

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
    title,
    sectionCount,
  } = useMemo(() => {
    if (!cnuData) {
      return { data: [], title: "Répartition des effectifs", sectionCount: 0 };
    }

    let dataToProcess: Array<{
      item_id: string;
      itemLabel: string;
      totalCount: number;
      maleCount: number;
      femaleCount: number;
    }> = [];
    let chartTitle = "";
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

            const sectionsData = targetGroup.sections.map((section) => {
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

              return {
                item_id: section.section_code,
                itemLabel: `${section.section_code} - ${section.section_name}`,
                totalCount: section.section_total || 0,
                maleCount,
                femaleCount,
              };
            });

            dataToProcess = sectionsData;
            chartTitle = `${
              labels.sectionPlural.charAt(0).toUpperCase() +
              labels.sectionPlural.slice(1)
            } - ${targetGroup.group_name}`;
          }
        }
      } else if (context === "geo" || context === "structures") {
        if (cnuData.cnu_groups_with_sections) {
          const allSectionsInGroup: Array<{
            item_id: string;
            itemLabel: string;
            totalCount: number;
            maleCount: number;
            femaleCount: number;
          }> = [];

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
                  item_id: `${discipline._id.discipline_code}_${section.section_code}`,
                  itemLabel: `${discipline._id.discipline_name} - ${section.section_code} - ${section.section_name}`,
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                });
              });
            }
          });

          if (allSectionsInGroup.length > 0) {
            totalSections = allSectionsInGroup.length;
            dataToProcess = allSectionsInGroup;
            chartTitle = `Sections du groupe ${groupId}`;
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
                  item_id: section.section_code,
                  itemLabel: `${section.section_code} - ${section.section_name}`,
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                });
              });
            }
          });

          totalSections = allSections.length;
          dataToProcess = allSections;
          chartTitle = `${
            labels.sectionPlural.charAt(0).toUpperCase() +
            labels.sectionPlural.slice(1)
          } - ${targetItem._id.discipline_name}`;
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
                  item_id: `${discipline._id.discipline_code}_${group.group_code}_${section.section_code}`,
                  itemLabel: `${discipline._id.discipline_name} - ${group.group_name} - ${section.section_name}`,
                  totalCount: section.section_total || 0,
                  maleCount,
                  femaleCount,
                });
              });
            });
          });

          totalSections = allSections.length;
          dataToProcess = allSections;

          const contextDisplayName =
            context === "geo"
              ? "région sélectionnée"
              : "établissement sélectionné";
          chartTitle = `${
            labels.sectionPlural.charAt(0).toUpperCase() +
            labels.sectionPlural.slice(1)
          } - ${contextDisplayName}`;
        }
      }
    } else {
      const allSections: Array<{
        item_id: string;
        itemLabel: string;
        totalCount: number;
        maleCount: number;
        femaleCount: number;
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
                item_id: section.section_code,
                itemLabel: `${section.section_code} - ${section.section_name}`,
                totalCount: section.section_total || 0,
                maleCount,
                femaleCount,
              });
            });
          });
        });

        totalSections = allSections.length;
        dataToProcess = allSections;
        chartTitle = `Toutes les ${labels.sectionPlural}`;
      }
    }

    const getColor = (femalePercent: number) => {
      if (femalePercent < 40) return "#efcb3a";
      if (femalePercent > 60) return "#e18b76";
      return "#9BB7D4";
    };

    const processedData = dataToProcess.map((item) => {
      const femalePercent =
        item.totalCount > 0 ? (item.femaleCount / item.totalCount) * 100 : 50;

      return {
        x: item.femaleCount,
        y: item.maleCount,
        z: item.totalCount,
        name: item.itemLabel,
        color: getColor(femalePercent),
        maleCount: item.maleCount,
        femaleCount: item.femaleCount,
        totalCount: item.totalCount,
        sectionCode: item.item_id,
      };
    });

    processedData.sort((a, b) => b.z - a.z);

    return {
      data: processedData,
      title: chartTitle,
      sectionCount: totalSections,
    };
  }, [cnuData, contextId, groupId, context, labels]);

  const config = {
    id: `${context}-sections-bubbles`,
    idQuery: `faculty-members-cnu`,
    title: {
      fr: groupId
        ? `${
            labels.sectionPlural.charAt(0).toUpperCase() +
            labels.sectionPlural.slice(1)
          } du ${labels.groupSingular} sélectionné`
        : contextId
        ? `${
            labels.sectionPlural.charAt(0).toUpperCase() +
            labels.sectionPlural.slice(1)
          } de ${labels.singular} sélectionnée`
        : `Toutes les ${labels.sectionPlural}`,
    },
    description: {
      fr: "Répartition par genre des effectifs (axe X: femmes, axe Y: hommes, taille: effectif total)",
    },
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
      title,
      selectedYear,
      bubbleData,
      maxValue,
      padding,
      labels: {
        sectionSingular: labels.sectionSingular,
        sectionPlural: labels.sectionPlural,
      },
    })
  );

  return (
    <>
      <ChartWrapper
        config={config}
        options={bubbleOptions}
        legend={null}
        renderData={() => <RenderData data={bubbleData} />}
      />

      <div className="fr-text--xs fr-mt-2w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-8">
            <div className="fr-text--center">
              <span className="fr-mr-3w">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#efcb3a",
                    marginRight: "5px",
                    borderRadius: "50%",
                  }}
                ></span>
                Majorité d'hommes (&lt;40% femmes)
              </span>
              <span className="fr-mr-3w">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#9BB7D4",
                    marginRight: "5px",
                    borderRadius: "50%",
                  }}
                ></span>
                Parité (40-60% femmes)
              </span>
              <span>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#e18b76",
                    marginRight: "5px",
                    borderRadius: "50%",
                  }}
                ></span>
                Majorité de femmes (&gt;60% femmes)
              </span>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <div className="fr-text--center">
              <em>Taille des bulles = effectif total</em>
            </div>
          </div>
        </div>

        <div className="fr-text--center fr-mt-2w">
          <div className="fr-text--sm" style={{ color: "#666" }}>
            📍 La ligne diagonale pointillée représente la parité parfaite
            <br />• Au-dessus : plus d'hommes • En-dessous : plus de femmes
          </div>
        </div>
      </div>
    </>
  );
}

export default SectionsBubbleChart;
