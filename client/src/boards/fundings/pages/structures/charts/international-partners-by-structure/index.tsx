import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, funders, getColorFromFunder, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

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
      by_international_partners: {
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

  const partners = data?.aggregations?.by_international_partners?.buckets ?? [];
  const series = funders.map((funder) => ({
    color: getColorFromFunder(funder),
    data: partners.map((partner) => partner.by_project_type.buckets.find((project) => project.key === funder)?.unique_projects?.value ?? 0),
    name: funder,
  }));
  const categories = partners.map((partner) => partner.key.split("###")[1].split("_")[1]);

  const config = {
    id: "internationalPartnersByStructure",
    integrationURL: "/integration?chart_id=internationalPartnersByStructure",
    title: `Partenaires internationaux de ${name} ${getYearRangeLabel({ yearMax, yearMin })}`,
  };

  const localOptions = {
    legend: { enabled: true },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function (this: any) { `${this.y} projects` },
        },
        stacking: "normal",
      }
    },
    series,
    tooltip: {
      formatter: function (this: any) {
        return `<b>${this.y}</b> projets ont débuté ${getYearRangeLabel({ isBold: true, yearMax, yearMin })} grâce aux financements de <b>${this.series.name}</b> auxquels prend part <b>${name}</b>`;
      }
    },
  };
  const options: object = deepMerge(getGeneralOptions("", categories, "", ""), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="international-partners-by-structure">
      {isLoading ? <DefaultSkeleton height="600px" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
};