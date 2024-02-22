import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Template from "./template";
import { GetHorizon2020Participation } from "./query";
import options from "./options";

export default function Horizon2020Participation() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');

  const { data, isLoading } = useQuery({
    queryKey: ["european-projects", params],
    queryFn: () => GetHorizon2020Participation(params)
  })

  if (isLoading) return <Template />

  return <HighchartsReact highcharts={Highcharts} options={options(data["funding_programme"].filter((item) => item.country_code === 'FR'))} />;
}