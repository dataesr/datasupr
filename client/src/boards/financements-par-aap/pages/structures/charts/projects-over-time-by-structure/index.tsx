import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, funders, getCssColor, getEsQuery, getGeneralOptions, years } from "../../../../utils.ts";

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
          by_project_year: {
            terms: {
              field: "project_year",
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

  const seriesBudget = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.by_project_year?.buckets.find((item) => item.key === year)?.sum_budget?.value ?? 0),
    marker: { enabled: false },
    name: funder,
  })).reverse();
  const seriesParticipation = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.by_project_year?.buckets.find((item) => item.key === year)?.sum_budget_participation?.value ?? 0),
    marker: { enabled: false },
    name: funder,
  })).reverse();
  const seriesProjects = funders.map((funder) => ({
    color: getCssColor({ name: funder, prefix: "funder" }),
    data: years.map((year) => (data?.aggregations?.by_project_type?.buckets ?? []).find((bucket) => bucket.key === funder)?.by_project_year?.buckets.find((item) => item.key === year)?.unique_projects?.value ?? 0),
    marker: { enabled: false },
    name: funder,
  })).reverse();

  const config = {
    comment: { "fr": <>Ce graphique présente l’évolution temporelle du nombre de projets ou de leurs montants associés, ventilée par financeur, à travers des lignes empilées permettant d’apprécier la contribution relative de chacun dans le temps. Pour les financements européens, Horizon 2020 couvre la période 2014–2020, tandis que son successeur, Horizon Europe couvre 2021-2027. Les montants indiqués reflètent le financement global des projets auxquels l’établissement participe et ne correspondent pas aux sommes effectivement perçues par celui-ci.</> },
    id: "projectsOverTimeByStructure",
  };

  // If view by number of projects
  let axis = 'Nombre de projets financés';
  let series = seriesProjects;
  let title = `Evolution temporelle du nombre de projets auxquels participe l'établissement (${name})`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> projets <b>${this.series.name}</b> en <b>${this.x}</b> auxquels prend part <b>${name}</b>`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = 'Montants globaux financés (€)';
      series = seriesBudget;
      title = `Evolution temporelle du montant financé pour les projets auxquels participe l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés en <b>${this.x}</b> pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = 'Montants financés pour cet établissement (€)';
      series = seriesParticipation;
      title = `Evolution temporelle du montant alloué pour les projets auxquels participe l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été alloués en <b>${this.x}</b> pour les projets <b>${this.series.name}</b> auxquels participe <b>${name}</b>`;
      };
      break;
  }

  const localOptions = {
    legend: { enabled: true, reversed: true },
    plotOptions: {
      series: { pointStart: Number(years[0]) },
      area: {
        stacking: "normal",
        marker: {
          enabled: false,
          lineColor: "#666666",
          lineWidth: 1,
          symbol: "circle"
        }
      }
    },
    series,
    tooltip: { formatter: tooltip },
  };
  const options: HighchartsInstance.Options = deepMerge(getGeneralOptions("", [], "Année de début du projet", axis, "area"), localOptions);

  // TODO: implement it later
  // const renderData = (options: HighchartsInstance.Options) => {
  //   const columns = (options?.series ?? []).map((serie) => serie.name);
  //   const rows: any = [];
  //   (options?.series ?? []).forEach((serie: any, i) => {
  //     (serie?.data ?? []).forEach((d, j) => {
  //       if (i === 0) rows.push([]);
  //       rows[j].push(d ?? 0);
  //     });
  //   });

  //   return (
  //     <div style={{ width: "100%" }}>
  //       <div className="fr-table-responsive">
  //         <table
  //           className="fr-table fr-table--bordered fr-table--sm"
  //           style={{ width: "100%" }}
  //         >
  //           <thead>
  //             <tr>
  //               <th>Année</th>
  //               {columns.map((column) => (
  //                 <th key={column} scope="col">{column}</th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {rows.map((row, index) => (
  //               <tr key={index}>
  //                 <th scope="row">{index + years[0]}</th>
  //                 {row.map((r) => (
  //                   <td key={r}>{r}</td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className={`chart-container chart-container--${color}`} id="projects-over-time-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
