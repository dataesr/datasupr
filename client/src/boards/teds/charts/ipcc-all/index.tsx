import { useSearchParams } from "react-router-dom";


import { useQueryResponse } from "../hooks";
import { getLabel } from "../utils";
import bool from "./query";
import Template from "./template";
import { getOptions, getSeries } from "./utils";
import ChartWrapper from "../../../../components/chart-wrapper";

export default function IpccAll() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQueryResponse(bool, 20, "");
  const currentLang = searchParams.get("language") || "FR";

  if (isLoading || !data) return Template();

  const { series, categories } = getSeries(data);
  const title = getLabel("ipcc_all", "title", currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipcc_all", "format1", currentLang),
    getLabel("ipcc_all", "format2", currentLang),
    getLabel("ipcc_all", "title_x_axis", currentLang),
    getLabel("ipcc_all", "title_y_axis", currentLang)
  );

  const chartConfig = {
    id: "ipcc_all",
    title: {
      fr: "Classements des pays par nombre de publications IPCC",
      en: "Rankings of countries by number of IPCC publications",
    },
    description: {
      fr: (
        <div>
          Description du graphique qui classe les pays par nombre de publications IPCC.
          <br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora quae sint recusandae dicta ipsum repellat perferendis a exercitationem
          animi suscipit similique, soluta maiores doloribus quia facere aut reprehenderit obcaecati molestiae.
        </div>
      ),
      en: (
        <div>
          Description of the chart ranking countries by number of IPCC publications.
          <br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora quae sint recusandae dicta ipsum repellat perferendis a exercitationem
          animi suscipit similique, soluta maiores doloribus quia facere aut reprehenderit obcaecati molestiae.
        </div>
      ),
    },
  };

  return <ChartWrapper config={chartConfig} options={options} legend={null} />;
}
 