import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsTreemap from "highcharts/modules/treemap";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersCNU } from "../../../../api/use-cnu";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import { useContextDetection } from "../../../../utils";
import { createGroupTreemapOptions } from "./options";

HighchartsTreemap(Highcharts);

export function GroupCNUTreemapChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();

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
        urlPath: "discipline",
      },
      geo: {
        singular: "région",
        plural: "régions",
        groupSingular: "département",
        groupPlural: "départements",
        urlPath: "geo",
      },
      structures: {
        singular: "établissement",
        plural: "établissements",
        groupSingular: "composante",
        groupPlural: "composantes",
        urlPath: "universite",
      },
    };
    return labels[context];
  };

  const labels = getLabels();

  const {
    data: treemapData,
    title,
    groupCount,
  } = useMemo(() => {
    if (!cnuData) {
      return { data: [], title: "Répartition des effectifs", groupCount: 0 };
    }

    let dataToProcess: Array<{
      item_id: string;
      itemLabel: string;
      totalCount: number;
      maleCount: number;
      femaleCount: number;
    }> = [];
    let chartTitle = "";
    let totalGroups = 0;

    if (contextId) {
      if (context === "fields") {
        const targetItem = cnuData.cnu_groups_with_sections?.find(
          (item) => item._id.discipline_code === contextId
        );

        if (targetItem && targetItem.groups && targetItem.groups.length > 0) {
          totalGroups = targetItem.groups.length;

          const groupsData = targetItem.groups.map((group) => {
            let maleCount = 0;
            let femaleCount = 0;

            if (group.sections) {
              group.sections.forEach((section) => {
                section.details?.forEach((detail) => {
                  if (detail.gender === "Masculin") {
                    maleCount += detail.count;
                  } else if (detail.gender === "Féminin") {
                    femaleCount += detail.count;
                  }
                });
              });
            }

            return {
              item_id: group.group_code,
              itemLabel: `${group.group_code} - ${group.group_name}`,
              totalCount: group.group_total || 0,
              maleCount,
              femaleCount,
            };
          });

          dataToProcess = groupsData;
          chartTitle = `${
            labels.groupPlural.charAt(0).toUpperCase() +
            labels.groupPlural.slice(1)
          } - ${targetItem._id.discipline_name}`;
        }
      } else if (context === "geo" || context === "structures") {
        if (
          cnuData.cnu_groups_with_sections &&
          cnuData.cnu_groups_with_sections.length > 0
        ) {
          const allGroups: Array<{
            item_id: string;
            itemLabel: string;
            totalCount: number;
            maleCount: number;
            femaleCount: number;
          }> = [];

          cnuData.cnu_groups_with_sections.forEach((discipline) => {
            if (discipline.groups) {
              discipline.groups.forEach((group) => {
                let maleCount = 0;
                let femaleCount = 0;

                if (group.sections) {
                  group.sections.forEach((section) => {
                    section.details?.forEach((detail) => {
                      if (detail.gender === "Masculin") {
                        maleCount += detail.count;
                      } else if (detail.gender === "Féminin") {
                        femaleCount += detail.count;
                      }
                    });
                  });
                }

                allGroups.push({
                  item_id: `${discipline._id.discipline_code}_${group.group_code}`,
                  itemLabel: `${discipline._id.discipline_name} - ${group.group_name}`,
                  totalCount: group.group_total || 0,
                  maleCount,
                  femaleCount,
                });
              });
            }
          });

          if (allGroups.length > 0) {
            totalGroups = allGroups.length;
            dataToProcess = allGroups;
            chartTitle = `Groupes CNU - ${contextName}`;
          }
        }
      }

      if (dataToProcess.length === 0) {
        chartTitle = `Aucun ${labels.groupSingular} pour ${contextName}`;
      }
    } else {
      if (
        cnuData.cnu_groups_with_sections &&
        cnuData.cnu_groups_with_sections.length > 0
      ) {
        totalGroups = cnuData.cnu_groups_with_sections.length;

        const itemsData = cnuData.cnu_groups_with_sections.map((item) => {
          let maleCount = 0;
          let femaleCount = 0;

          item.groups?.forEach((group) => {
            group.sections?.forEach((section) => {
              section.details?.forEach((detail) => {
                if (detail.gender === "Masculin") {
                  maleCount += detail.count;
                } else if (detail.gender === "Féminin") {
                  femaleCount += detail.count;
                }
              });
            });
          });

          return {
            item_id: item._id.discipline_code,
            itemLabel: item._id.discipline_name,
            totalCount: item.discipline_total || 0,
            maleCount,
            femaleCount,
          };
        });

        dataToProcess = itemsData;
        chartTitle = `Répartition par ${labels.singular}`;
      }
    }

    console.log("Data to process:", dataToProcess);

    const processedData = dataToProcess.map((item) => ({
      id: item.item_id,
      name: item.itemLabel,
      value: item.totalCount,
      colorValue:
        item.maleCount && item.femaleCount
          ? (item.femaleCount / (item.maleCount + item.femaleCount)) * 100
          : 50,
      maleCount: item.maleCount || 0,
      femaleCount: item.femaleCount || 0,
    }));

    processedData.sort((a, b) => b.value - a.value);

    return { data: processedData, title: chartTitle, groupCount: totalGroups };
  }, [cnuData, contextId, context, contextName, labels]);

  const config = {
    id: `${context}-groups-treemap`,
    idQuery: `faculty-members-cnu`,
    title: {
      fr: contextId
        ? `${
            labels.groupPlural.charAt(0).toUpperCase() +
            labels.groupPlural.slice(1)
          } de ${labels.singular} sélectionnée`
        : `Répartition par ${labels.singular}`,
      en: contextId
        ? `${labels.groupPlural} of the selected ${labels.singular}`
        : `Distribution by ${labels.singular}`,
    },
    description: {
      fr: contextId
        ? `Répartition des effectifs par ${labels.groupSingular} au sein de ${labels.singular}`
        : `Répartition des effectifs enseignants par ${labels.singular}`,
      en: contextId
        ? `Distribution of faculty members by ${labels.groupSingular} within the ${labels.singular}`
        : `Distribution of faculty members by ${labels.singular}`,
    },
    integrationURL: `/personnel-enseignant/${labels.urlPath}/typologie`,
  };

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-mb-2w">
          <span
            className="fr-icon-loader-line fr-icon--lg"
            aria-hidden="true"
          ></span>
        </div>
        <div>Chargement des données...</div>
      </div>
    );
  }

  if (!treemapData || treemapData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>
            Aucune donnée disponible pour {selectedYear}
            {contextId && ` et ${labels.singular} sélectionnée`}
          </p>
        </div>
      </div>
    );
  }

  if (contextId && groupCount === 1) {
    const singleGroup = treemapData[0];
    const femalePercent =
      singleGroup.value > 0
        ? Math.round((singleGroup.femaleCount / singleGroup.value) * 100)
        : 0;
    const malePercent = 100 - femalePercent;

    return (
      <div className="fr-py-4w">
        <div className="fr-alert fr-alert--info">
          <h3 className="fr-alert__title">
            {labels.groupSingular.charAt(0).toUpperCase() +
              labels.groupSingular.slice(1)}{" "}
            unique
          </h3>
          <p>
            Cette {labels.singular} ne contient qu'un seul{" "}
            {labels.groupSingular} : <strong>{singleGroup.name}</strong>
          </p>
          <div className="fr-mt-3w">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h4 className="fr-card__title">Effectif total</h4>
                      <p className="fr-text--xl fr-mb-0">
                        <strong>{singleGroup.value.toLocaleString()}</strong>{" "}
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
                          {singleGroup.maleCount.toLocaleString()}
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
                          {singleGroup.femaleCount.toLocaleString()}
                        </strong>{" "}
                        ({femalePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="fr-mt-3w fr-text--sm">
            Un treemap n'est pas nécessaire pour visualiser un seul{" "}
            {labels.groupSingular}. Les données détaillées sont disponibles dans
            les sections ci-dessus.
          </p>
        </div>
      </div>
    );
  }

  const treemapOptions = CreateChartOptions(
    "treemap",
    createGroupTreemapOptions({
      title,
      selectedYear,
      treemapData,
      contextId: contextId || null,
      labels,
    })
  );

  return (
    <>
      <ChartWrapper
        config={config}
        options={treemapOptions}
        legend={null}
        renderData={undefined}
      />

      <div className="fr-text--xs fr-mt-2w" style={{ display: "block" }}>
        <div className="fr-text--center">
          <span className="fr-mr-3w">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#efcb3a",
                marginRight: "5px",
                borderRadius: "2px",
              }}
            ></span>
            Majorité d'hommes
          </span>
          <span className="fr-mr-3w">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#EFEFEF",
                marginRight: "5px",
                borderRadius: "2px",
                border: "1px solid #ddd",
              }}
            ></span>
            Parité
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#e18b76",
                marginRight: "5px",
                borderRadius: "2px",
              }}
            ></span>
            Majorité de femmes
          </span>
        </div>

        <div className="fr-text--center fr-mt-1w">
          <em>
            {contextId
              ? `${
                  labels.groupPlural.charAt(0).toUpperCase() +
                  labels.groupPlural.slice(1)
                } de ${labels.singular} sélectionnée`
              : `Cliquez sur une ${labels.singular} pour voir ses ${labels.groupPlural}`}
          </em>
        </div>
      </div>
    </>
  );
}

export default GroupCNUTreemapChart;
