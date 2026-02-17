import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "highcharts/modules/pattern-fill";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, formatPercent, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel, pattern } from "../../../../utils.ts";
import i18n from "../../../i18n.json";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function ProjectsByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const [selectedControl, setSelectedControl] = useState("projects");
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
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
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-projects-by-structure", structure, yearMax, yearMin],
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
  const categories: string[] = [];
  funders.forEach((funder, index) => {
    const funderData = (data?.aggregations?.by_project_type?.buckets ?? []).find((item) => item.key === funder)?.is_coordinator?.buckets;
    const isCoord = funderData?.find((bucket) => bucket.key === 1);
    const isNotCoord = funderData?.find((bucket) => bucket.key === 0);
    const isCoordBudget = isCoord?.sum_budget?.value ?? 0;
    const isNotCoordBudget = isNotCoord?.sum_budget?.value ?? 0;
    seriesBudget.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: [{ name: funder, x: index, y: isNotCoordBudget, y_perc: isNotCoordBudget === 0 ? 0 : isNotCoordBudget / (isCoordBudget + isNotCoordBudget), total: isCoordBudget + isNotCoordBudget, color: getCssColor({ name: funder, prefix: "funder" }) }],
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesBudget.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: [{ name: funder, x: index, y: isCoordBudget, y_perc: isCoordBudget === 0 ? 0 : isCoordBudget / (isCoordBudget + isNotCoordBudget), total: isCoordBudget + isNotCoordBudget, color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } } }],
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    const isCoordParticipation = isCoord?.sum_budget_participation?.value ?? 0;
    const isNotCoordParticipation = isNotCoord?.sum_budget_participation?.value ?? 0;
    seriesParticipation.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: [{ name: funder, x: index, y: isNotCoordParticipation, y_perc: isNotCoordParticipation === 0 ? 0 : isNotCoordParticipation / (isCoordParticipation + isNotCoordParticipation), total: isCoordParticipation + isNotCoordParticipation, color: getCssColor({ name: funder, prefix: "funder" }) }],
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: [{ name: funder, x: index, y: isCoordParticipation, y_perc: isCoordParticipation === 0 ? 0 : isCoordParticipation / (isCoordParticipation + isNotCoordParticipation), total: isCoordParticipation + isNotCoordParticipation, color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } } }],
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    const isCoordProject = isCoord?.unique_projects?.value ?? 0;
    const isNotCoordProject = isNotCoord?.unique_projects?.value ?? 0;
    seriesProject.push({
      color: getCssColor({ name: funder, prefix: "funder" }),
      data: [{ name: funder, x: index, y: isNotCoordProject, y_perc: isNotCoordProject === 0 ? 0 : isNotCoordProject / (isCoordProject + isNotCoordProject), total: isCoordProject + isNotCoordProject, color: getCssColor({ name: funder, prefix: "funder" }) }],
      name: [funder, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } },
      data: [{ name: funder, x: index, y: isCoordProject, y_perc: isCoordProject === 0 ? 0 : isCoordProject / (isCoordProject + isNotCoordProject), total: isCoordProject + isNotCoordProject, color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: funder, prefix: "funder" }) } } }],
      name: [funder, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    categories.push(funder);
  });

  const config = {
    comment: { "fr": <>Ce graphique indique, par financeur, le nombre et le montant des projets auxquels participe l'établissement {name}. Les montants affichés ne correspondent pas aux financements effectivement perçus par l'établissement. Ils représentent le volume total de financement des projets auxquels l’établissement participe, indépendamment de la part réelle qui lui est attribuée. </> },
    id: "projectsByStructure",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let dataLabel = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''} (${formatPercent(this.y_perc)})`;
  };
  let series = seriesProject;
  let stackLabel = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  let title = `Nombre de projets financés auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participe <b>${name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}, soit ${formatPercent(this.y_perc)} (${this.y} / ${this.total} )`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €  (${formatPercent(this.y_perc)})`;
      };
      series = seriesBudget;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      title = `Montant total des projets auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> financés ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>, soit ${formatPercent(this.y_perc)} (${formatCompactNumber(this.y)} € / ${formatCompactNumber(this.total)}  €)`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants alloués (€)';
      dataLabel = function (this: any) {
        return `${formatCompactNumber(this.y)} €  (${formatPercent(this.y_perc)})`;
      };
      series = seriesParticipation;
      stackLabel = function (this: any) {
        return `${formatCompactNumber(this.total)} €`;
      };
      title = `Montant alloué des projets auxquels l'établissement (${name}) participe, réparti par financeur ${getYearRangeLabel({ yearMax, yearMin })}`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> alloués ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>, soit ${formatPercent(this.y_perc)} (${formatCompactNumber(this.y)} € / ${formatCompactNumber(this.total)}  €)`;
      };
      break;
  };

  const localOptions = {
    exporting: { chartOptions: { title: { text: title } } },
    legend: { enabled: true },
    plotOptions: {
      bar: {
        dataLabels: {
          align: "right",
          enabled: false,
          formatter: dataLabel,
        },
        stacking: "normal",
      },
    },
    series,
    tooltip: { formatter: tooltip },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
        },
        formatter: stackLabel,
      },
    },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", categories, "", axis), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
