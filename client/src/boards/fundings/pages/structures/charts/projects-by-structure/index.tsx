import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils.ts";

const { VITE_APP_FUNDINGS_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function ProjectsByStructure() {
  const [field, setField] = useState("projects");
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  const structure = next.get("structure")?.toString() ?? "";
  const year = next.get("year")?.toString() ?? "";
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              project_year: year,
            },
          },
          // {
          //   term: {
          //     participant_isFrench: true,
          //   },
          // },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              "participant_id_name.keyword": structure,
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
          size: 30,
          // order: { "_count": "asc" }
        },
        aggregations: {
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
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-projects-by-structure', structure, year],
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
    name: bucket.key,
    y: field === "projects" ? bucket.unique_projects.value : bucket.sum_budget.value,
  }));
  const categories: string[] = series.map((item: { name: string }) => item.name);

  const titleProjects = `Nombre de projets pour ${getLabelFromName(structure)} par financeur pour l'année ${year}`;
  const titleBudget = `Montant total des projets pour ${getLabelFromName(structure)} par financeur pour l'année ${year}`;
  const axisProjects = "Nombre de projets";
  const axisBudget = "Montant total des projets";
  const tooltipProjects = function(this: any) {
    return `<b>${this.value}</b> projets ont débuté en <b>${year}</b> grâce au financement de <b>${this.name}</b> dont au moins un participant est une institution française active`
  };;
  const tooltipBudget = function(this: any) {
    return `<b>${formatCompactNumber(this.value)} €</b> ont été financés par <b>${this.name}</b> pour des projets débutés en <b>${year}</b> dont au moins un participant est une institution française active`
  };
  const config = {
    id: "projectsByStructure",
    integrationURL: "/integration?chart_id=projectsByStructure",
    title: field === "projects" ? titleProjects : titleBudget,
  };

  const options: object = {
    ...getGeneralOptions('', [], '', field === "projects" ? axisProjects : axisBudget),
    series: [{ data: series }],
    tooltip: {
      formatter: field === "projects" ? tooltipProjects : tooltipBudget,
    },
    xAxis: { categories },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-by-structure">
      <fieldset className="fr-segmented">
        <div className="fr-segmented__elements">
          <div className="fr-segmented__element">
            <input checked={ field === "projects" } id="segmented-1-1" name="segmented-1" onChange={() => {}} type="radio" value="projects" />
            <label className="fr-label" onClick={() => setField("projects")}>Nombre de projets</label>
          </div>
          <div className="fr-segmented__element">
            <input checked={ field === "budget" } id="segmented-1-2" name="segmented-1" onChange={() => {}} type="radio" value="budget" />
            <label className="fr-label" onClick={() => setField("budget")}>Montant total</label>
          </div>
        </div>
      </fieldset>
      <ChartWrapper config={config} options={options} />
    </div>
  );
}
