import { getOptions, getSeries } from "./utils";

import ChartWrapper from "../../../../components/chart-wrapper";
import Template from "./template";
import { getLabel } from "../utils";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "FR";
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "wg3" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "3");

  if (isLoading || !data) return Template();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  const title = getLabel("ipcc_wg", "wg3", currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipcc_wg", "format1", currentLang),
    getLabel("ipcc_wg", "format2", currentLang),
    getLabel("ipcc_wg", "title_x_axis", currentLang),
    getLabel("ipcc_wg", "title_y_axis", currentLang)
  );

  const chartConfig = {
    id: "ipcc_wg3",
    title: {
      fr: "Groupe de travail 3 : Atténuation du changement climatique",
      en: "Working Group 3: Mitigation of Climate Change",
    },
  };

  return <ChartWrapper config={chartConfig} options={options} legend={null} />;
}
