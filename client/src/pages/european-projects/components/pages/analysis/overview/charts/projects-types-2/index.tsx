import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";

export default function ProjectsTypes2() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["projectsTypes2", params],
    queryFn: () => GetData(params)
  })

  if (isLoading || !data) return <Template />
  return (
    <ChartWrapper
      id="projectsTypes2"
      options={options(data)}
      legend={(
        <ul className="legend">
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#6DD897", marginRight: "10px" }} />
            <span>Pays sélectionné</span>
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#09622A", marginRight: "10px" }} />
            <span>UE & Etats associés</span>
          </li>
        </ul>
      )}
    />
  )

}