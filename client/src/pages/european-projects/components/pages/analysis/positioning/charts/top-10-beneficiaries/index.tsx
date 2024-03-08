import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";

export default function Top10Beneficiaries() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["Top10Beneficiaries", params],
    queryFn: () => GetData(params)
  })

  if (isLoading || !data) return <Template />
  return (
    <ChartWrapper
      id="top10beneficiaries"
      options={options(data, searchParams.get('country_code') ?? null)}
      legend={(
        <ul className="legend">
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#233E41", marginRight: "10px" }}></div>
            <span>Total des subventions en euros €</span>
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#D75521", marginRight: "10px" }}></div>
            <span>Poids du cumul des subventions (%)</span>
          </li>
        </ul>
      )}
    />
  );
}