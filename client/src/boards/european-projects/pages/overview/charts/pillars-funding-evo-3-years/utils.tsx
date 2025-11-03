import { formatToMillions, formatToRates } from "../../../../../../utils/format";

export function getDefaultParams(searchParams) {
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join("&");

  return params + "&stage=successful";
}

export function successRatesReadingKey(data) {
  const dataSelectedCountry = data?.filter((item) => item.country !== "all")[0];
  const year = dataSelectedCountry?.data[0]?.pillars[0]?.years[0]?.year || "2021";
  const pillar_name_fr = dataSelectedCountry?.data[0]?.pillars[0]?.pilier_name_fr || "unknown";
  const pillar_name_en = dataSelectedCountry?.data[0]?.pillars[0]?.pilier_name_en || "unknown";

  // Récupération des données pour le calcul des pourcentages
  const dataGlobal = data?.filter((item) => item.country === "all")[0];

  // Financement évalué du pays sélectionné (stage: "evaluated")
  const evaluatedCountryFunding =
    dataSelectedCountry?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 0;

  // Financement évalué global (stage: "evaluated")
  const evaluatedGlobalFunding =
    dataGlobal?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 1;

  // Financement lauréat du pays sélectionné (stage: "successful")
  const successfulCountryFunding =
    dataSelectedCountry?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 0;

  // Financement lauréat global (stage: "successful")
  const successfulGlobalFunding =
    dataGlobal?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 1;

  // Calcul des pourcentages
  const pct1 = evaluatedCountryFunding / evaluatedGlobalFunding;
  const pct2 = successfulCountryFunding / successfulGlobalFunding;

  return {
    fr: (
      <>
        En <strong>{year}</strong>, la part de financements des projets évalués pour le pilier <strong>{pillar_name_fr}</strong> est de{" "}
        <strong>{formatToRates(pct1)}</strong> tandis que la part des financements des projets lauréats pour la même année est de{" "}
        <strong>{formatToRates(pct2)}</strong>.
      </>
    ),
    en: (
      <>
        In <strong>{year}</strong>, the share of funding for evaluated projects for the <strong>{pillar_name_en}</strong> pillar is{" "}
        <strong>{formatToRates(pct1)}</strong>, while the share of funding for successful projects for the same year is{" "}
        <strong>{formatToRates(pct2)}</strong>.
      </>
    ),
  };
}

export function valuesSuccessReadingKey(data) {
  const dataSelectedCountry = data?.filter((item) => item.country !== "all")[0];
  const year = dataSelectedCountry?.data[0]?.pillars[0]?.years[0]?.year || "2021";
  const evaluatedFunding =
    dataSelectedCountry?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 0;
  const successfulFunding =
    dataSelectedCountry?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year)?.total_fund_eur || 0;
  const successRate = evaluatedFunding > 0 ? successfulFunding / evaluatedFunding : 0;

  return {
    fr: (
      <>
        En <strong>{year}</strong>, les subventions sur les projets évalués s'élèvent à <strong>{formatToMillions(evaluatedFunding)}</strong> alors
        que sur les projets lauréats, celles-ci sont de <strong>{formatToMillions(successfulFunding)}</strong>. Cela représente un taux de succès de{" "}
        <strong>{formatToRates(successRate)} %</strong>.
      </>
    ),
    en: (
      <>
        In <strong>{year}</strong>, the funding for evaluated projects amounts to <strong>{formatToMillions(evaluatedFunding)}</strong>, while for
        successful projects, it amounts to <strong>{formatToMillions(successfulFunding)}</strong>. This represents a success rate of{" "}
        <strong>{formatToRates(successRate)}</strong>.
      </>
    ),
  };
}
