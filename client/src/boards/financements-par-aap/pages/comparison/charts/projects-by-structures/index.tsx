import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel, pattern } from "../../../../utils.ts";
import i18n from "../../../../i18n.json";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function ProjectsByStructures() {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures, yearMax, yearMin }),
    aggregations: {
      by_structure_project: {
        terms: {
          field: "participant_id_name_default.keyword",
          size: structures.length,
        },
        aggregations: {
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
                },
                aggregations: {
                  unique_projects: {
                    cardinality: {
                      field: "project_id.keyword",
                    },
                  },
                },
              },
            },
          },
        },
      },
      by_structure_budget: {
        terms: {
          field: "participant_id_name_default.keyword",
          order: { "sum_budget": "desc" },
          size: structures.length,
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetFinanced",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
                },
                aggregations: {
                  sum_budget: {
                    sum: {
                      field: "project_budgetFinanced",
                    },
                  },
                },
              },
            },
          },
        },
      },
      by_structure_participation: {
        terms: {
          field: "participant_id_name_default.keyword",
          order: { "sum_budget_participation": "desc" },
          size: structures.length,
        },
        aggregations: {
          sum_budget_participation: {
            sum: {
              field: "participation_funding",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              is_coordinator: {
                terms: {
                  field: "participation_is_coordinator",
                },
                aggregations: {
                  sum_budget_participation: {
                    sum: {
                      field: "participation_funding",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-projects-by-structures", structures, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const structuresProject = data?.aggregations?.by_structure_project?.buckets ?? [];
  const seriesProjectCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: structuresProject.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesProjectNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: structuresProject.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesProject = structuresProject.map((item) => item.key.split('###')[1]);
  const structuresBudget = data?.aggregations?.by_structure_budget?.buckets ?? [];
  const seriesBudgetCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: structuresBudget.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesBudgetNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: structuresBudget.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesBudget = structuresBudget.map((item) => item.key.split('###')[1]);
  const structuresParticipation = data?.aggregations?.by_structure_participation?.buckets ?? [];
  const seriesParticipationCoord: any = funders.map((funder) => ({
    color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
    data: structuresParticipation.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
  })).reverse();
  const seriesParticipationNotCoord: any = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: structuresParticipation.map((bucket) => bucket.by_project_type.buckets.find((item) => item.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0),
    name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
  })).reverse();
  const categoriesParticipation = structuresParticipation.map((item) => item.key.split('###')[1]);

  const config = {
    comment: { "fr": <>Ce graphique compare la répartition des projets financés par AAP selon les financeurs pour plusieurs établissements.
L’analyse doit porter en priorité sur les proportions relatives entre catégories de financeurs, plutôt que sur les volumes absolus, afin de comparer la structure des portefeuilles de projets entre établissements de tailles différentes. Les montants indiqués correspondent au financement global des projets auxquels les établissements participent et ne reflètent pas les sommes effectivement perçues.
</> },
    id: "projectsByStructures",
  };

  // If view by number of projects
  let axis = getI18nLabel(i18n, 'number_of_projects_funded');
  let categories = categoriesProject;
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProjectNotCoord.concat(seriesProjectCoord);
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let title = `Répartition des projets financés par type de financeur – comparaison entre établissements ${getYearRangeLabel({ yearMax, yearMin })}`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${categoriesProject[this.x]}</b>`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = getI18nLabel(i18n, 'funding_total');
      categories = categoriesBudget;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudgetNotCoord.concat(seriesBudgetCoord);
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      title = `Montant total des projets par financeur – comparaison entre établissements ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesProject[this.x]}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = getI18nLabel(i18n, 'funding_by_structure');
      categories = categoriesParticipation;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesParticipationNotCoord.concat(seriesParticipationCoord);
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      title = `Montant total des projets par financeur – comparaison entre établissements ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été alloués par <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesProject[this.x]}</b>`;
      };
      break;
  }

  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
        },
        formatter: stackLabel,
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: dataLabel,
        },
        stacking: "normal",
      }
    },
    series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structures">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
