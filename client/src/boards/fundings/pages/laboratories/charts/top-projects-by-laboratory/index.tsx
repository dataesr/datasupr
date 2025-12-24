import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions, getLabelFromName } from "../../../../utils";
import LaboratoriesSelector from "../../components/laboratoriesSelector";
import YearsSelector from "../../../../components/yearsSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopProjectsByLaboratory() {
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState<string>("265906719###FR_Centre hospitalier régional universitaire de Lille");
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
              "participants.structure.id_name.keyword": selectedLaboratoryId
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
    queryKey: ['fundings-top-projects-by-laboratory', selectedLaboratoryId, selectedYearEnd, selectedYearStart],
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

  const series = (data?.hits?.hits ?? []).map(
    (hit) => ({
      color: getColorFromFunder(hit._source.type),
      name: hit._source.label?.fr ?? hit._source.label?.en,
      type: hit._source.type,
      y: hit._source.budgetTotal,
    })
  );
  const categories = series.map((item: { name: any; }) => item.name);

  const config = {
    id: "topProjectsByLaboratory",
    integrationURL: "/integration?chart_id=topProjectsByLaboratory",
    title: `Top 25 projets pour ${getLabelFromName(selectedLaboratoryId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
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
        return `${getLabelFromName(selectedLaboratoryId)} a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par ${this.point.type}.`
      },
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-laboratory">
      <LaboratoriesSelector
        selectedLaboratoryId={selectedLaboratoryId}
        setSelectedLaboratoryId={setSelectedLaboratoryId}
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
