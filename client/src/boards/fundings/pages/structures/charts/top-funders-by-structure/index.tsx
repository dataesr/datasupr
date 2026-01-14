import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByStructure() {
  const [searchParams] = useSearchParams();
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const next = new URLSearchParams(searchParams);
  const selectedStructure = next.get("structure")?.toString() ?? "";
  const color = useChartColor();

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: selectedYearStart,
                lte: selectedYearEnd,
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
              "participant_id_name.keyword": selectedStructure,
            },
          },
        ],
      },
    },
    aggs: {
      by_funder_type: {
        terms: {
          field: "project_type.keyword",
          size: 25,
        },
        aggs: {
          unique_projects: {
            cardinality: {
              field: "project_id.keyword",
            },
          },
        },
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-top-funders-by-structure", selectedStructure, selectedYearEnd, selectedYearStart],
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

  // if (isLoading || !data) return <DefaultSkeleton />;

  const series = (data?.aggregations?.by_funder_type?.buckets ?? []).map((item: { unique_projects: any; key: string; doc_count: number }) => ({
    color: getColorFromFunder(item.key),
    data: [item.unique_projects.value],
    name: item.key,
  }));
  const categories = series.map((item: { name: any }) => item.name);

  const config = {
    id: "topFundersByStructure",
    integrationURL: "/integration?chart_id=topFundersByStructure",
  };

  const options: object = {
    ...getGeneralOptions("", categories, "Financeurs", "Nombre de projets financés"),
    legend: {
      align: "center",
      enabled: true,
      layout: "horizontal",
      reversed: false,
      verticalAlign: "bottom",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{series.name}",
        },
        stacking: undefined,
      },
    },
    series,
    tooltip: {
      format: `<b>{series.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part <b>${getLabelFromName(
        selectedStructure
      )}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`,
    },
    xAxis: {
      categories,
      labels: { enabled: false },
      title: { text: "Financeurs" },
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
      <Title as="h3" look="h6">{`Top 25 des financeurs pour ${getLabelFromName(
        selectedStructure
      )} sur la période ${selectedYearStart}-${selectedYearEnd}`}</Title>
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      {isLoading ? <DefaultSkeleton height="800" /> : <ChartWrapper config={config} options={options} />}
    </div>
  );
}
