import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { formatCompactNumber, getGeneralOptions, getLabelFromName } from "../../../../utils";
import StructuresSelector from "../../components/structuresSelector";
import { getCategoriesAndSeries } from "./utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopProjectsByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

  const body = {
    size: 25,
    query: {
      bool: {
        filter: [
          {
            range: {
              year: {
                gte: selectedYearStart,
                lte: selectedYearEnd
              }
            }
          },
          {
            term: {
              "participants.structure.id_name.keyword": selectedStructureId
            }
          }
        ]
      }
    },
    sort: [
      {
        budgetTotal: { order: "desc" }
      }
    ]
  }

  const { data, isLoading } = useQuery({
    queryKey: [`fundings-top-projects-by-structure`, selectedStructureId, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-projects`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoading || !data) return <DefaultSkeleton />;
  const { categories, series } = getCategoriesAndSeries(data);

  const config = {
    id: "topProjectsByStructure",
    integrationURL: "/integration?chart_id=topProjectsByStructure",
    title: `Top 25 projets pour ${getLabelFromName(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions(
      '',
      categories,
      '',
      'Budget total'
    ),
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    series: [{ data: series }],
    tooltip: {
      formatter: function (this: any) {
        return `${getLabelFromName(selectedStructureId)} a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par ${this.point.type}.`
      },
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
      <StructuresSelector
        selectedStructureId={selectedStructureId}
        setSelectedStructureId={setSelectedStructureId}
      />
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      <ChartWrapper
        config={config}
        legend={null}
        options={options}
      />
    </div>
  );
}
