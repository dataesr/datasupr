import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions } from "../../../../utils.ts";
import { FundingsSources } from "../../../graph-config.js";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsOverTimeByStructure({ name }: { name: string | undefined }) {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  const structure = next.get("structure")?.toString() ?? "";
  const color = useChartColor();
  const years = Array.from(Array(10).keys()).map((item) => item + 2015);

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: years[0],
              },
            },
          },
          {
            term: {
              participant_isFrench: true,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              "participant_id.keyword": structure,
            },
          },
          {
            terms: {
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"],
            },
          },
        ]
      },
    },
    aggregations: {
      by_project_type: {
        terms: {
          field: "project_type.keyword",
          size: 50,
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
            },
            aggs: {
              unique_projects: {
                cardinality: {
                  field: "project_id.keyword",
                },
              },
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
    queryKey: ['funding-projects-over-time-by-structure', structure],
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

  if (isLoading || !data) return <DefaultSkeleton />;

  const series = data.aggregations.by_project_type.buckets.map((bucket) => ({
    color: getColorFromFunder(bucket.key),
    data: years.map((year) => bucket.by_project_year.buckets.find((item) => item.key === year)?.[field === "projects" ? "unique_projects" : "sum_budget"]?.value ?? 0),
    marker: { enabled: false },
    name: bucket.key
  }));

  const titleProjects = `Nombre de projets de ${name} par financeur sur la période ${years[0]}-${years[years.length - 1]}, par année de début du projet`;
  const titleBudget = `Montant total des projets de ${name} par financeur sur la période ${years[0]}-${years[years.length - 1]}, par année de début du projet`;
  const axisProjects = "Nombre de projets";
  const axisBudget = "Montant total";
  const tooltipProjects = function (this: any) {
    return `<b>${this.y}</b> projets ont débuté en <b>${this.x}</b> grâce au financement de <b>${this.series.name}</b> avec la participation de <b>${name}</b>`;
  };
  const tooltipBudget = function (this: any) {
    return `<b>${formatCompactNumber(this.y)} €</b> ont été financés par <b>${this.series.name}</b> pour des projets débutés en <b>${this.x}</b> auxquels prend part <b>${name}</b>`;
  };
  const config = {
    id: "projectsOverTimeByStructure",
    sources: FundingsSources,
  };

  const options: object = {
    ...getGeneralOptions('', [], 'Année de début du projet', field === "projects" ? axisProjects : axisBudget),
    tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
    chart: {
      height: '600px',
      type: 'area'
    },
    plotOptions: {
      series: {
        pointStart: years[0]
      },
      area: {
        stacking: 'normal',
        marker: {
          enabled: false,
          lineColor: '#666666',
          lineWidth: 1,
          symbol: 'circle'
        }
      }
    },
    series,
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-over-time-by-structure">
      <Title as="h2" look="h6">
        {field === "projects" ? titleProjects : titleBudget}
      </Title>
      <fieldset className="fr-segmented">
        <div className="fr-segmented__elements">
          <div className="fr-segmented__element">
            <input checked={field === "projects"} id="projects-over-time-by-structure-projects" name="projects-over-time-by-structure-projects" onChange={() => { }} type="radio" value="projects" />
            <label className="fr-label" onClick={() => setField("projects")}>Nombre de projets</label>
          </div>
          <div className="fr-segmented__element">
            <input checked={field === "budget"} id="projects-over-time-by-structure-budget" name="projects-over-time-by-structure-budget" onChange={() => { }} type="radio" value="budget" />
            <label className="fr-label" onClick={() => setField("budget")}>Montant total</label>
          </div>
        </div>
      </fieldset>
      <ChartWrapper config={config} options={options} />
    </div>
  );
}