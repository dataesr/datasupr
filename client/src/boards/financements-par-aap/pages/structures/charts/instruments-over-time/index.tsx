import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import HighchartsInstance from "highcharts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { createChartOptions } from "../../../../../../components/chart-wrapper/default-options";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getI18nLabel } from "../../../../../../utils";
import ChartWrapperFundings from "../../../../components/chart-wrapper-fundings";
import SegmentedControl from "../../../../components/segmented-control";
import { deepMerge, formatCompactNumber, getCssColor, getEsQuery, getGeneralOptions, pattern, years } from "../../../../utils.ts";
import i18n from "../../../../i18n.json";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function InstrumentsOverTime({ name }: { name: string | undefined }) {
  const [selectedControl, setSelectedControl] = useState("projects");
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const color = useChartColor();

  const body = {
    ...getEsQuery({ structures: [structure] }),
    aggregations: {
      by_instrument: {
        terms: {
          field: "project_instrument.keyword",
          size: 10,
        },
        aggregations: {
          by_project_year: {
            terms: {
              field: "project_year",
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
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["funding-instruments-over-time-by-structure", structure],
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

  const seriesBudget: any = [];
  const seriesParticipation: any = [];
  const seriesProject: any = [];
  (data?.aggregations?.by_instrument?.buckets ?? []).forEach((instrument) => {
    seriesBudget.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }) } },
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesBudget.push({
      color: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }),
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }) } },
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.sum_budget_participation?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesParticipation.push({
      color: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }),
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.sum_budget_participation?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
    seriesProject.push({
      color: { pattern: { ...pattern, backgroundColor: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }) } },
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 1)?.unique_projects?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'coordinator')].join(' - '),
    });
    seriesProject.push({
      color: getCssColor({ name: instrument.key.split('-')?.[0].split(' ')?.[0].trim().toLowerCase(), prefix: "instrument" }),
      data: years.map((year) => instrument?.by_project_year?.buckets.find((item) => item.key === year)?.is_coordinator?.buckets?.find((bucket) => bucket.key === 0)?.unique_projects?.value ?? 0),
      marker: { enabled: false },
      name: [instrument.key, getI18nLabel(i18n, 'not-coordinator')].join(' - '),
    });
  });

  const config = {
    comment: { "fr": <>Ce graphique présente l’évolution temporelle du nombre de projets ou de leurs montants associés, ventilée par financeur, à travers des lignes empilées permettant d’apprécier la contribution relative de chacun dans le temps. Pour les financements européens, Horizon 2020 couvre la période 2014–2020, tandis que son successeur, Horizon Europe couvre 2021-2027. Les montants indiqués reflètent le financement global des projets auxquels l’établissement participe et ne correspondent pas aux sommes effectivement perçues par celui-ci.</> },
    id: "projectsOverTimeByStructure",
  };

  // If view by number of projects
  let axis = getI18nLabel(i18n, 'number_of_projects_funded');
  let series = seriesProject.reverse();
  let title = `Evolution temporelle des instruments dont a bénéficié l'établissement (${name})`;
  let tooltip = function (this: any) {
    return `<b>${this.y}</b> instruments <b>${this.series.name}</b> en <b>${this.x}</b> dont a bénéficié <b>${name}</b>`;
  };
  switch (selectedControl) {
    // If view by global amount
    case 'amount_global':
      axis = getI18nLabel(i18n, 'funding_total');
      series = seriesBudget.reverse();
      title = `Evolution temporelle du montant financé par instrument dont a bénéficié l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été financés en <b>${this.x}</b> par l'instrument <b>${this.series.name}</b> dont a bénéficié <b>${name}</b>`;
      };
      break;
    // If view by amount by structure
    case 'amount_by_structure':
      axis = getI18nLabel(i18n, 'funding_by_structure');
      series = seriesParticipation.reverse();
      title = `Evolution temporelle du montant perçu par instrument dont a bénéficié l'établissement (${name})`;
      tooltip = function (this: any) {
        return `<b>${formatCompactNumber(this.y)} €</b> ont été perçus en <b>${this.x}</b> par l'instrument <b>${this.series.name}</b> dont a bénéficié <b>${name}</b>`;
      };
      break;
  };

  const localOptions = {
    legend: { enabled: true, reversed: true },
    plotOptions: {
      area: {
        stacking: "normal",
        marker: {
          enabled: false,
          lineColor: "#666666",
          lineWidth: 1,
          symbol: "circle",
        },
      },
      series: { pointStart: Number(years[0]) },
    },
    series,
    title: { text: "" },
    tooltip: { formatter: tooltip },
    xAxis: { categories: [], title: { text: "Année de début du projet" } },
    yAxis: { title: { text: "" } },
  };
  const generalOptions = createChartOptions("area", { chart: { height: "800px" } });
  const options: HighchartsInstance.Options = deepMerge(generalOptions, localOptions);

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
    <div className={`chart-container chart-container--${color}`} id="instruments-over-time-by-structure">
      <Title as="h2" look="h6">
        {title}
      </Title>
      <SegmentedControl selectedControl={selectedControl} setSelectedControl={setSelectedControl} />
      {isLoading ? <DefaultSkeleton height={String(options?.chart?.height)} /> : <ChartWrapperFundings config={config} options={options} />}
    </div>
  );
}
