import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import i18n from "../../../../i18n.json";
import { formatCompactNumber, funders, getCssColor, getYearRangeLabel, pattern } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function LaboratoriesByStructure({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  // No filter on typology bc some laboratories may have no typology, bc not in Paysage
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          { range: { project_year: { gte: yearMin, lte: yearMax } } },
          { term: { participant_isFrench: true } },
          { term: { participant_status: "active" } },
          { term: { participant_type: "laboratory" } },
          { terms: { "project_type.keyword": funders } },
          { term: { "participant_institutions.structure.keyword": structure } },
        ],
      },
    },
    aggregations: {
      by_laboratory_project: {
        terms: {
          field: "co_partners_fr_labs.keyword",
          order: { "by_unique_projects": "desc" },
        },
        aggregations: {
          by_unique_projects: {
            cardinality: {
              field: "project_id.keyword",
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
      by_laboratory_budget: {
        terms: {
          field: "participant_encoded_key",
          size: 25,
          order: { "sum_budget": "desc" },
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
      by_laboratory_participation: {
        terms: {
          field: "participant_encoded_key",
          size: 25,
          order: { "sum_budget_participation": "desc" },
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
    queryKey: ["fundings-projects-by-structures", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const seriesBudget: any = [];
  const seriesParticipation: any = [];
  const seriesProject: any = [];
  const laboratoriesBudget = data?.aggregations?.by_laboratory_budget?.buckets ?? [];
  const laboratoriesParticipation = data?.aggregations?.by_laboratory_participation?.buckets ?? [];
  const laboratoriesProject = data?.aggregations?.by_laboratory_project?.buckets ?? [];
  funders.forEach((funder) => {
    seriesBudget.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: laboratoriesBudget.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesBudget.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: laboratoriesBudget.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: laboratoriesParticipation.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: laboratoriesParticipation.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: laboratoriesProject.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesProject.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: laboratoriesProject.map((bucket) => bucket.by_project_type.buckets.find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0),
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
  });
  const categoriesBudget = laboratoriesBudget.map((bucket) => (Object.fromEntries(new URLSearchParams(bucket.key))).label);
  const categoriesParticipation = laboratoriesParticipation.map((bucket) => (Object.fromEntries(new URLSearchParams(bucket.key))).label);
  const categoriesProject = laboratoriesProject.map((bucket) => (Object.fromEntries(new URLSearchParams(bucket.key))).label);

  const title = `Principaux laboratoires de ${name} impliqués dans les projets par AAP ${getYearRangeLabel({ yearMax, yearMin })}`;
  // If view by number of projects
  let axis = getI18nLabel(i18n, 'number_of_projects_funded');
  let categories = categoriesProject;
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  let series = seriesProject.reverse();
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participe <b>${categoriesProject[this.x]}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = getI18nLabel(i18n, 'funding_total');
      categories = categoriesBudget;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesBudget.reverse();
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés au global dans le cadre de projets <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} auxquels prend part <b>${categoriesBudget[this.x]}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = getI18nLabel(i18n, 'funding_by_structure');
      categories = categoriesParticipation;
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €`;
      };
      series = seriesParticipation.reverse();
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été perçus par <b>${categoriesBudget[this.x]}</b> dans le cadre de projets <b>${this.series.name}</b> pour des projets débutés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
      };
      break;
  };

  const config = {
    comment: { "fr": <>Ce graphe présente la répartition des projets financés par appels à projets (AAP) dans lesquels l'établissement est impliqué, ventilée par laboratoire et par financeur.
Les sources de données ne donnent pas toujours accès au niveau laboratoire. Pour les projets européens, c'est un travail mené avec 5 organismes pour ajouter ce niveau, avec un délai d'actualisation de un an. Pour le PIA, les données au niveau laboratoire ne sont pas disponibles.
Le type de participation est distingué, en pointillé quand l'établissement est coordinateur, en couleur simple s'il est partenaire non-coordinateur. Le financement global représente le volume total de financements des projets auxquels participe l'établissement. Le financement perçu approxime la part réelle allouée à chaque établissement partenaire d’un projet (en assimilant consommation et subvention pour le PIA).
</> },
    id: "laboratoriesByStructures",
    integrationURL: `/integration?chart_id=laboratoriesByStructures&${searchParams.toString()}`,
    title,
  };

  const options: HighchartsInstance.Options = {
    chart: { height: "1000px" },
    legend: { enabled: true, reversed: true },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: dataLabel,
        },
        stacking: "normal",
      },
    },
    series,
    title: { text: "" },
    tooltip: { formatter: tooltip },
    xAxis: { categories, title: { text: "" } },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
        },
        formatter: stackLabel,
      },
      title: { text: axis },
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="laboratories-by-structures">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height="1000px" /> : <ChartWrapperFundings config={config} hideTitle options={options} />}
    </div>
  );
}
