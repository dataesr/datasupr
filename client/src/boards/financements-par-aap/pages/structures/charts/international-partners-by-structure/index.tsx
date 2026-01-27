import { SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getCssColor } from "../../../../../../utils/colors.ts";
import ChartWrapperCustom from "../../../../components/chart-wrapper-custom";
import { deepMerge, formatCompactNumber, funders, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function InternationalPartnersByStructure({ name }: { name: string | undefined }) {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_international_partners_project: {
        terms: {
          field: "co_partners_foreign_inst.keyword",
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
      by_international_partners_budget: {
        terms: {
          field: "co_partners_foreign_inst.keyword",
          order: { "sum_budget": "desc" },
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
    queryKey: ["fundings-international-partners", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const partnersProject = data?.aggregations?.by_international_partners_project?.buckets ?? [];
  const seriesProject = funders.map((funder) => ({
    color: getCssColor(`funder-${funder.toLowerCase().replaceAll(" ", "-")}`),
    data: partnersProject.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.unique_projects?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesProject = partnersProject.map((partner) => partner.key.split("###")[1].split("_")[1]);
  const partnersBudget = data?.aggregations?.by_international_partners_budget?.buckets ?? [];
  const seriesBudget = funders.map((funder) => ({
    color: getCssColor(`funder-${funder.toLowerCase().replaceAll(" ", "-")}`),
    data: partnersBudget.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.sum_budget?.value ?? 0),
    name: funder,
  })).reverse();
  const categoriesBudget = partnersBudget.map((partner) => partner.key.split("###")[1].split("_")[1]);

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
    return `<b>${formatCompactNumber(this.y)} €</b> financés pour les projets <b>${this.series.name}</b> auxquels participent <b>${name}</b> et <b>${this.key}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> auxquels participent <b>${name}</b> et <b>${this.key}</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`;
  };

  const config = {
    comment: { "fr": <>Ce graphe montre quels partenaires internationaux collaborent le plus avec l'établissement sur les projets financés par AAP.
Les barres représentent le nombre / le montant total des projets auxquels chaque partenaire participe conjointement avec l'établissement.
Certains partenaires internationaux se distinguent par un volume élevé de projets, signalant des collaborations stratégiques et récurrentes à l’international.
Ces montants ne reflètent pas les financements réellement reçus par l'établissement ou ses partenaires, mais indiquent l’importance relative de leur participation dans l’écosystème de projets financés par AAP</> },
    id: "internationalPartnersByStructure",
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
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", field === "projects" ? categoriesProject : categoriesBudget, "", field === "projects" ? axisProjects : axisBudget), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="international-partners-by-structure">
      <Title as="h2" look="h6">
        {`Principaux partenaires internationaux de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`}
      </Title>
      <SegmentedControl name="international-partners-by-structure-segmented">
        <SegmentedElement checked={field === "projects"} label="Nombre de projets financés" onClick={() => setField("projects")} value="projects" />
        <SegmentedElement checked={field === "budget"} label="Montants financés" onClick={() => setField("budget")} value="budget" />
      </SegmentedControl>
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperCustom config={config} options={options} />}
    </div>
  );
};
