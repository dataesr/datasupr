import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings/index.tsx";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function Classifications2ByStructure({ name }: { name: string | undefined }) {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_classifications_project: {
        terms: {
          field: "project_classification.primary_field.keyword",
          size: 25,
        },
        aggregations: {
          by_project_type: {
            terms: {
              field: "project_type.keyword",
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
      by_classifications_budget: {
        terms: {
          field: "project_classification.primary_field.keyword",
          order: { "sum_budget": "desc" },
          size: 25,
        },
        aggregations: {
          sum_budget: {
            sum: {
              field: "project_budgetTotal",
            },
          },
          by_project_type: {
            terms: {
              field: "project_type.keyword",
            },
            aggregations: {
              sum_budget: {
                sum: {
                  field: "project_budgetTotal",
                },
              },
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-classifications2", structure, yearMax, yearMin],
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

  const classificationsProject = data?.aggregations?.by_classifications_project?.buckets ?? [];
  const seriesProject = classificationsProject.map((classification) => ({
    color: getCssColor({ name: classification.key, prefix: "classification" }),
    data: funders.map((funder) => classification?.by_project_type?.buckets?.find((bucket) => bucket.key === funder)?.unique_projects?.value ?? 0),
    name: classification.key,
  })).reverse();
  const classificationsBudget = data?.aggregations?.by_classifications_budget?.buckets ?? [];
  const seriesBudget = classificationsBudget.map((classification) => ({
    color: getCssColor({ name: classification.key, prefix: "classification" }),
    data: funders.map((funder) => classification?.by_project_type?.buckets?.find((bucket) => bucket.key === funder)?.sum_budget?.value ?? 0),
    name: classification.key,
  })).reverse();

  const axisBudget = "Montants financés (€)";
  const axisProjects = "Nombre de projets financés";
  const datalabelBudget = function (this: any) {
    return `${formatCompactNumber(this.y)} €`;
  };
  const datalabelProject = function (this: any) {
    return `${this.y} projet${this.y > 1 ? 's' : ''}`;
  };
  const stacklabelProject = function (this: any) {
    return `${this.total} projet${this.total > 1 ? 's' : ''}`;
  };
  const stacklabelBudget = function (this: any) {
    return `${formatCompactNumber(this.total)} €`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> financés pour les projets <b>${this.key}</b> auxquels participent <b>${name}</b> en <b>${this.series.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.key}</b> auxquels participent <b>${name}</b> en <b>${this.series.name}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };

  const config = {
    comment: { "fr": <>Ce graphe présente la distribution des projets auxquels participe l'établissement, par financeur et selon les grandes classifications disciplinaires.
Les barres représentent le nombre / le montant total des projets rattachés à chaque domaine, permettant d’identifier les champs scientifiques les plus présents dans les projets auxquels l’établissement participe. Les montants affichés ne correspondent pas aux financements réellement perçus par l’établissement, mais au volume global des projets financés dans lesquels il est impliqué. Ils doivent être interprétés comme un indicateur d’activité disciplinaire, et non comme un budget reçu. Les thématiques ont été estimées par IA, à partir du titre, résumé et mots clés des projets.</> },
    id: "classifications2ByStructure",
  };

  const localOptions = {
    legend: { enabled: true, reversed: true },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        },
        formatter: field === "projects" ? stacklabelProject : stacklabelBudget,
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: field === "projects" ? datalabelProject : datalabelBudget,
        },
        stacking: "normal",
      }
    },
    series: field === "projects" ? seriesProject : seriesBudget,
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", funders, "", field === "projects" ? axisProjects : axisBudget), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="classifications2-by-structure">
      <Title as="h2" look="h6">
        {`Classifications disciplinaires par financeur de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl name="classifications2-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
};
