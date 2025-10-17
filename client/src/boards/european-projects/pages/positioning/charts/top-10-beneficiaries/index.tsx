import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getData } from "./query";
import { useGetParams } from "./utils";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

import { EPChartsSource, EPChartsUpdateDate } from "../../../../config.js";

const config = {
  id: "top10beneficiaries",
  idQuery: "top10beneficiaries",
  comment: {
    fr: (
      <>
        Ce graphique représente le positionnement du pays sélectionné par rapport aux autres pays en fonction des subventions reçues. La courbe
        correspond au cumul des subventions allouées.
      </>
    ),
    en: (
      <>
        This chart shows the positioning of the selected country compared to other countries based on the subsidies received. The curve corresponds to
        the cumulative subsidies allocated.
      </>
    ),
  },
  readingKey: {
    //TODO: add reading key
    fr: <>readingKey</>,
    en: <>readingKey en</>,
  },
  source: EPChartsSource,
  updateDate: EPChartsUpdateDate,
  title: {
    fr: "Classement des bénéficiaires",
    en: "Beneficiaries ranking",
  },
  integrationURL: "/european-projects/components/pages/analysis/positioning/charts/top-10-beneficiaries",
};

export default function Top10Beneficiaries() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = useGetParams();

  const { data, isLoading } = useQuery({
    queryKey: [config.idQuery, params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const prepareData = (data) => {
    // Add selected country if it is not in the top 10
    const dataToReturn = data.top10.slice(0, 10);
    const selectedCountry = searchParams.get("country_code");
    if (selectedCountry) {
      const pos = data.top10.findIndex((item) => item.id === selectedCountry);
      if (pos >= 10 && pos !== -1) {
        dataToReturn.pop();
        const countryData = data.top10[pos];
        dataToReturn.push(countryData);
      }
    }
    return dataToReturn;
  };

  return (
    <ChartWrapper
      config={config}
      legend={null}
      options={options(prepareData(data), searchParams.get("country_code") ?? null, currentLang)}
      renderData={() => null} // TODO: add data table
    />
  );
}
