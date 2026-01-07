import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { formatCompactNumber, getColorFromFunder, getGeneralOptions, getLabelFromName, sortedFunders } from "../../../../utils";
import StructuresSelector from "../../components/structuresSelector";

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
    queryKey: ['fundings-top-projects-by-structure', selectedStructureId, selectedYearEnd, selectedYearStart],
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
  const series: { color: string, name: string, type: string, y: number }[] = (data?.hits?.hits ?? []).map(
    (hit) => ({
      color: getColorFromFunder(hit._source.type),
      name: hit._source.label?.default ?? hit._source.label?.fr ?? hit._source.label?.en,
      type: hit._source.type,
      y: hit._source.budgetTotal,
    })
  );
  const categories = series.map((item: { name: any; }) => item.name);
  const funders: string[] = [...new Set(series.map((serie) => serie.type))];

  const config = {
    id: "topProjectsByStructure",
    integrationURL: "/integration?chart_id=topProjectsByStructure",
    title: `Top 25 des projets pour ${getLabelFromName(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions('', categories, '', 'Budget total'),
    legend: { enabled: false },
    series: [{ data: series }],
    tooltip: {
      formatter: function (this: any) {
        return `<b>${getLabelFromName(selectedStructureId)}</b> a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par <b>${this.point.type}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`
      },
    },
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-projects-by-structure">
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
        legend={
          <ul className="legend">
            {funders.map((funder) => (
              <li
                key={funder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    background: sortedFunders?.[funder.toLowerCase()] ?? '#00ff00',
                    height: "20px",
                    marginRight: "10px",
                    width: "20px"
                  }}
                ></div>
                <span>{funder}</span>
              </li>
            ))}
          </ul>
        }
        options={options}
      />
    </div>
  );
}
