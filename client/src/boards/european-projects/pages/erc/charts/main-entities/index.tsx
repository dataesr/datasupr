import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import Options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
import { rangeOfYearsToApiFormat } from "../../url-utils";
import { formatToMillions } from "../../../../../../utils/format";

const ERC_DESTINATIONS = [
  { code: "ALL", labelFr: "Tous types de financement", labelEn: "All funding types" },
  { code: "ADG", labelFr: "Advanced grants (ADG)", labelEn: "Advanced grants (ADG)" },
  { code: "COG", labelFr: "Consolidator grants (COG)", labelEn: "Consolidator grants (COG)" },
  { code: "STG", labelFr: "Starting grants (STG)", labelEn: "Starting grants (STG)" },
  { code: "SyG", labelFr: "Synergy grants (SyG)", labelEn: "Synergy grants (SyG)" },
  { code: "POC", labelFr: "Proof of Concept (POC)", labelEn: "Proof of Concept (POC)" },
];

function useGetParams() {
  const [searchParams] = useSearchParams();
  const params: string[] = [];
  const countryCode = searchParams.get("country_code") || "FRA";
  params.push(`country_code=${countryCode}`);
  const rangeOfYears = searchParams.get("range_of_years");
  const callYear = rangeOfYearsToApiFormat(rangeOfYears);
  if (callYear) params.push(`call_year=${callYear}`);
  const currentLang = (searchParams.get("language") || "fr") as "fr" | "en";
  return { params: params.join("&"), currentLang };
}

function renderDataTable(data: { list: { acronym: string | null; name: string; total_fund_eur: number }[] }, currentLang: string) {
  if (!data?.list?.length) return null;
  const lang = currentLang as "fr" | "en";
  return (
    <table className="fr-table fr-table--sm">
      <caption>{lang === "fr" ? "Principales entités ERC" : "Main ERC entities"}</caption>
      <thead>
        <tr>
          <th scope="col">{lang === "fr" ? "Acronyme" : "Acronym"}</th>
          <th scope="col">{lang === "fr" ? "Nom" : "Name"}</th>
          <th scope="col">{lang === "fr" ? "Financement (€)" : "Funding (€)"}</th>
        </tr>
      </thead>
      <tbody>
        {data.list.map((item, i) => (
          <tr key={i}>
            <td>{item.acronym || "—"}</td>
            <td>{item.name}</td>
            <td>{formatToMillions(item.total_fund_eur)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ErcMainEntities() {
  const { params: urlParams, currentLang } = useGetParams();
  const [selectedDestination, setSelectedDestination] = useState("ALL");
  const color = useChartColor();

  const queryParams = selectedDestination === "ALL" ? urlParams : `${urlParams}&destination_code=${selectedDestination}`;

  const { data, isLoading } = useQuery({
    queryKey: ["ercMainEntities", queryParams],
    queryFn: () => getData(queryParams),
    enabled: !!queryParams,
  });

  const destLabel = ERC_DESTINATIONS.find((d) => d.code === selectedDestination);
  const titleSuffixFr = destLabel && selectedDestination !== "ALL" ? ` — ${destLabel.labelFr}` : "";
  const titleSuffixEn = destLabel && selectedDestination !== "ALL" ? ` — ${destLabel.labelEn}` : "";

  const titleConfig = {
    fr: `Top 10 des entités ERC par financement${titleSuffixFr}`,
    en: `Top 10 ERC entities by funding${titleSuffixEn}`,
  };

  const config = {
    id: "ercMainEntities",
    comment: {
      fr: <>Les 10 entités ayant obtenu le plus de financements ERC pour le pays sélectionné.</>,
      en: <>The 10 entities that received the most ERC funding for the selected country.</>,
    },
    integrationURL: "/european-projects/components/pages/erc/charts/main-entities",
  };

  return (
    <div className={`fr-mt-5w chart-container chart-container--${color}`}>
      {isLoading || !data ? (
        <DefaultSkeleton />
      ) : !data.list?.length ? (
        <p className="fr-text--sm fr-hint-text">{currentLang === "fr" ? "Aucune donnée disponible." : "No data available."}</p>
      ) : (
        <>
          <ChartWrapper.Title config={{ title: titleConfig, id: config.id }} />
          <div className="fr-select-group fr-m-2w">
            <label className="fr-label" htmlFor="erc-destination-select">
              {currentLang === "fr" ? "Type de financement" : "Funding type"}
            </label>
            <select
              className="fr-select"
              id="erc-destination-select"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              {ERC_DESTINATIONS.map((dest) => (
                <option key={dest.code} value={dest.code}>
                  {currentLang === "fr" ? dest.labelFr : dest.labelEn}
                </option>
              ))}
            </select>
          </div>
          <ChartWrapper config={config} options={Options(data, currentLang)} renderData={() => renderDataTable(data, currentLang)} />
        </>
      )}
    </div>
  );
}
