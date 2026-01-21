import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

import "highcharts/modules/map";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function InternationalPartnersByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
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
          by_international_partners: {
            terms: {
              field: "co_partners_foreign_inst.keyword",
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
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fundings-international-partners', structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  console.log(data);
  const series = (data?.aggregations?.by_project_type?.buckets ?? []).map((funder) => ({
    name: funder,
    data: funder.
  }));
  const categories = [];
  console.log(series);

  const config = {
    id: "internationalPartnersByStructure",
    integrationURL: "/integration?chart_id=internationalPartnersByStructure",
  };

  const localOptions = {
    legend: { reversed: true },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          // formatter: function (this: any) { return field === "projects" ? this.y : `${formatCompactNumber(this.y)} €` },
        },
        stacking: "normal",
      }
    },
    series,
    // tooltip: { formatter: field === "projects" ? tooltipProjects : tooltipBudget },
  };
  const options: object = deepMerge(getGeneralOptions("", categories, "", ""), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="international-partners-by-structure">
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
};