import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import i18n from "../../../../i18n.json";
import { formatCompactNumber, funders, getCssColor, getEsQuery, pattern, years } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function ProjectsOverTimeByStructure({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure] }),
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 50,
        },
        aggregations: {
          is_coordinator: {
            terms: {
              field: "participation_is_coordinator",
            },
            aggregations: {
              by_project_year: {
                terms: {
                  field: "project_year",
                  size: 25,
                },
                aggregations: {
                  unique_projects: {
                    cardinality: {
                      field: "project_id.keyword",
                    },
                  },
                  sum_budget: {
                    sum: {
                      field: "project_budgetFinanced",
                    },
                  },
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
    queryKey: ["funding-projects-over-time-by-structure", structure],
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

  const seriesBudget: any[] = [];
  const seriesParticipation: any[] = [];
  const seriesProject: any[] = [];
  funders.map((funder) => {
    seriesBudget.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.sum_budget?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesBudget.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.sum_budget?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.sum_budget_participation?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.sum_budget_participation?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.unique_projects?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesProject.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.by_project_year?.buckets.find((bucket) => bucket.key === year)?.unique_projects?.value ?? 0),
      marker: { enabled: false },
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
  });

  // If view by number of projects
  let axis = getI18nLabel(i18n, 'number_of_projects_funded');
  let series = seriesProject.reverse();
  let title = `Evolution temporelle du nombre de projets auxquels participe l'établissement (${name})`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> en <b>${this.x}</b> auxquels prend part <b>${name}</b>`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = getI18nLabel(i18n, 'funding_total');
      series = seriesBudget.reverse();
      title = `Evolution temporelle des financements globaux pour les projets auxquels participe l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés en <b>${this.x}</b> pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = getI18nLabel(i18n, 'funding_by_structure');
      series = seriesParticipation.reverse();
      title = `Evolution temporelle des financements perçus pour les projets auxquels participe l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été perçus en <b>${this.x}</b> pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>`;
      };
      break;
  };

  const config = {
    comment: { "fr": <>Ce graphique présente l’évolution temporelle du nombre de projets, des financements globaux et des financements perçus, ventilée par financeur, à travers des lignes empilées permettant d’apprécier la contribution relative de chacun dans le temps. Pour les financements européens, Horizon 2020 couvre la période 2014–2020, tandis que son successeur, Horizon Europe couvre 2021-2027. Le type de participation est distingué, en pointillé quand l'établissement est coordinateur, en couleur simple s'il est partenaire non-coordinateur. Le financement global représente le volume total de financements des projets auxquels participe l'établissement. Le financement perçu approxime la part réelle allouée à chaque établissement partenaire d’un projet (en assimilant consommation et subvention pour le PIA).</> },
    id: "projectsOverTimeByStructure",
    integrationURL: `/integration?chart_id=projectsOverTimeByStructure&${searchParams.toString()}`,
    title,
  };

  const options: HighchartsInstance.Options = {
    chart: { type: "area" },
    legend: { enabled: true, reversed: true },
    plotOptions: {
      series: { legendSymbol: "rectangle", pointStart: Number(years[0]) },
      area: {
        marker: {
          enabled: false,
          lineColor: "#666666",
          lineWidth: 1,
          symbol: "circle",
        },
        stacking: "normal",
      },
    },
    series,
    title: { text: "" },
    tooltip: { formatter: tooltip },
    xAxis: { categories: [], title: { text: "Année de début du projet" } },
    yAxis: { title: { text: axis } },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-over-time-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapperFundings config={config} hideTitle options={options} />}
    </div>
  );
}
