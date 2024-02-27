import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetfundedObjectives } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getColorByPillierName } from "./utils";

export default function FundedObjectives() {
  const [searchParams] = useSearchParams();
  let params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  params += '&stage=successful';
  const { data, isLoading } = useQuery({
    queryKey: ["fundedObjectives", params],
    queryFn: () => GetfundedObjectives(params)
  })

  if (isLoading || !data) return <Template />


  const pillierLegend = [
    { name: "Excellence scientifique", color: getColorByPillierName("Excellence scientifique") },
    { name: "Problématiques mondiales et compétitivité industrielle européenne", color: getColorByPillierName("Problématiques mondiales et compétitivité industrielle européenne") },
    { name: "Europe plus innovante", color: getColorByPillierName("Europe plus innovante") },
    { name: "Élargir la participation et renforcer l'espace européen de la recherche", color: getColorByPillierName("Élargir la participation et renforcer l'espace européen de la recherche") },
  ];

  return (
    <ChartWrapper
      id="fundedObjectives"
      options={options(data)}
      legend={(
        <ul className="legend">
          {pillierLegend.map((item) => (
            <li key={item.name} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <div style={{ width: "20px", height: "20px", background: item.color, marginRight: "10px" }}></div>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    />
  )

}