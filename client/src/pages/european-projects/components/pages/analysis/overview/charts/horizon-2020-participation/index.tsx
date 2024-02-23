import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetHorizon2020Participation } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";

export default function Horizon2020Participation() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const iso2 = searchParams.get('country_code') || 'FR';

  const { data, isLoading } = useQuery({
    queryKey: ["european-projects", params],
    queryFn: () => GetHorizon2020Participation(params)
  })

  if (isLoading) return <Template />

  const getColorByPillierName = (name) => {
    if (name === "Science d'excellence") {
      return "#9ef9be";
    } else if (name === "Problématiques mondiales et compétitivité industrielle européenne") {
      return "#4b5d67";
    } else if (name === "Europe plus innovante") {
      return "#87556f";
    } else {
      return "#cecece";
    }
  };

  const pillierLegend = [
    { name: "Science d'excellence", color: getColorByPillierName("Science d'excellence") },
    { name: "Problématiques mondiales et compétitivité industrielle européenne", color: getColorByPillierName("Problématiques mondiales et compétitivité industrielle européenne") },
    { name: "Europe plus innovante", color: getColorByPillierName("Europe plus innovante") },
    { name: "Élargir la participation et renforcer l'espace européen de la recherche", color: getColorByPillierName("Élargir la participation et renforcer l'espace européen de la recherche") },
  ];

  return (
    <ChartWrapper
      id="Horizon2020Participation"
      options={options(data["funding_programme"].filter((item) => item.country_code === iso2))}
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