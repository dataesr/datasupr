import { useQuery } from "@tanstack/react-query";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";
import ChartWrapper from "../../../../../chart-wrapper";

export default function FundingRanking() {
  const { data, isLoading } = useQuery({
    queryKey: ["fundingRanking"],
    queryFn: () => GetData()
  })

  if (isLoading || !data) return <Template />

  const prepareData = (data, sortKey) => {
    return data.sort((a, b) => b[sortKey] - a[sortKey]).slice(0, 10);
  }

  return (
    <ChartWrapper
      id="fundingRankingSub"
      options={options(prepareData(data, "total_successful"))}
      legend={(
        <ul className="legend">
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#009099", marginRight: "10px" }} />
            <span>Projets évalués</span>
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#233E41", marginRight: "10px" }} />
            <span>Projets lauréats</span>
          </li>
        </ul>
      )}
    />
  )

}