import { formatToMillions, formatToRates } from "../../../../../../utils/format";

export function getDefaultParams(searchParams) {
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join("&");

  return params + "&stage=successful";
}

export function successRatesReadingKey(data, displayType) {
  console.log("successRatesReadingKey", displayType);

  const dataSelectedCountry = data?.filter((item) => item.country !== "all")[0];
  const year = dataSelectedCountry?.data[0]?.pillars[0]?.years[0]?.year || "2021";
  const pillar_name_fr = dataSelectedCountry?.data[0]?.pillars[0]?.pilier_name_fr || "unknown";
  const pillar_name_en = dataSelectedCountry?.data[0]?.pillars[0]?.pilier_name_en || "unknown";

  // Récupération des données pour le calcul des pourcentages
  const dataGlobal = data?.filter((item) => item.country === "all")[0];

  const dataYearEvaluated = dataSelectedCountry?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year);
  const dataYearSuccessful = dataSelectedCountry?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year);
  const dataYearEvaluatedGlobal = dataGlobal?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year);
  const dataYearSuccessfulGlobal = dataGlobal?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year);

  let fr;
  let en;

  switch (displayType) {
    case "total_coordination_number": {
      // Coordinations évaluées et lauréates du pays sélectionné
      const evaluatedCountryCoordination = dataYearEvaluated?.total_coordination_number || 0;
      const successfulCountryCoordination = dataYearSuccessful?.total_coordination_number || 0;

      // Coordinations évaluées et lauréates globales
      const evaluatedGlobalCoordination = dataYearEvaluatedGlobal?.total_coordination_number || 1;
      const successfulGlobalCoordination = dataYearSuccessfulGlobal?.total_coordination_number || 1;

      // Calcul des pourcentages
      const pct1Coordination = evaluatedCountryCoordination / evaluatedGlobalCoordination;
      const pct2Coordination = successfulCountryCoordination / successfulGlobalCoordination;

      fr = (
        <>
          En <strong>{year}</strong>, la part de coordinations des projets évalués pour le pilier <strong>{pillar_name_fr}</strong> est de{" "}
          <strong>{formatToRates(pct1Coordination)}</strong> tandis que la part des coordinations des projets lauréats pour la même année est de{" "}
          <strong>{formatToRates(pct2Coordination)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the share of coordinations for evaluated projects for the <strong>{pillar_name_en}</strong> pillar is{" "}
          <strong>{formatToRates(pct1Coordination)}</strong>, while the share of coordinations for successful projects for the same year is{" "}
          <strong>{formatToRates(pct2Coordination)}</strong>.
        </>
      );
      break;
    }

    case "total_number_involved": {
      // Participants évalués et lauréats du pays sélectionné
      const evaluatedCountryInvolved = dataYearEvaluated?.total_number_involved || 0;
      const successfulCountryInvolved = dataYearSuccessful?.total_number_involved || 0;

      // Participants évalués et lauréats globaux
      const evaluatedGlobalInvolved = dataYearEvaluatedGlobal?.total_number_involved || 1;
      const successfulGlobalInvolved = dataYearSuccessfulGlobal?.total_number_involved || 1;

      // Calcul des pourcentages
      const pct1Involved = evaluatedCountryInvolved / evaluatedGlobalInvolved;
      const pct2Involved = successfulCountryInvolved / successfulGlobalInvolved;

      fr = (
        <>
          En <strong>{year}</strong>, la part de participants sur les projets évalués pour le pilier <strong>{pillar_name_fr}</strong> est de{" "}
          <strong>{formatToRates(pct1Involved)}</strong> tandis que la part des participants sur les projets lauréats pour la même année est de{" "}
          <strong>{formatToRates(pct2Involved)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the share of participants for evaluated projects for the <strong>{pillar_name_en}</strong> pillar is{" "}
          <strong>{formatToRates(pct1Involved)}</strong>, while the share of participants for successful projects for the same year is{" "}
          <strong>{formatToRates(pct2Involved)}</strong>.
        </>
      );
      break;
    }

    default: {
      // Financement évalué du pays sélectionné (stage: "evaluated")
      const evaluatedCountryFunding = dataYearEvaluated?.total_fund_eur || 0;

      // Financement évalué global (stage: "evaluated")
      const evaluatedGlobalFunding = dataYearEvaluatedGlobal?.total_fund_eur || 1;

      // Financement lauréat du pays sélectionné (stage: "successful")
      const successfulCountryFunding = dataYearSuccessful?.total_fund_eur || 0;

      // Financement lauréat global (stage: "successful")
      const successfulGlobalFunding = dataYearSuccessfulGlobal?.total_fund_eur || 1;

      // Calcul des pourcentages
      const pct1 = evaluatedCountryFunding / evaluatedGlobalFunding;
      const pct2 = successfulCountryFunding / successfulGlobalFunding;

      fr = (
        <>
          En <strong>{year}</strong>, la part de financements des projets évalués pour le pilier <strong>{pillar_name_fr}</strong> est de{" "}
          <strong>{formatToRates(pct1)}</strong> tandis que la part des financements des projets lauréats pour la même année est de{" "}
          <strong>{formatToRates(pct2)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the share of funding for evaluated projects for the <strong>{pillar_name_en}</strong> pillar is{" "}
          <strong>{formatToRates(pct1)}</strong>, while the share of funding for successful projects for the same year is{" "}
          <strong>{formatToRates(pct2)}</strong>.
        </>
      );
    }
  }

  return {
    fr: fr,
    en: en,
  };
}

export function valuesSuccessReadingKey(data, displayType) {
  const dataSelectedCountry = data?.filter((item) => item.country !== "all")[0];
  const year = dataSelectedCountry?.data[0]?.pillars[0]?.years[0]?.year || "2021";
  const dataYearEvaluated = dataSelectedCountry?.data?.find((d) => d.stage === "evaluated")?.pillars[0]?.years?.find((y) => y.year === year);
  const dataYearSuccessful = dataSelectedCountry?.data?.find((d) => d.stage === "successful")?.pillars[0]?.years?.find((y) => y.year === year);
  // funding
  const evaluatedFunding = dataYearEvaluated?.total_fund_eur || 0;
  const successfulFunding = dataYearSuccessful?.total_fund_eur || 0;
  const successRate = evaluatedFunding > 0 ? successfulFunding / evaluatedFunding : 0;
  // coordinations
  const evaluatedTotalCoordinationNumber = dataYearEvaluated?.total_coordination_number || 0;
  const successfulTotalCoordinationNumber = dataYearSuccessful?.total_coordination_number || 0;
  const totalCoordinationNumberSuccessRate =
    evaluatedTotalCoordinationNumber > 0 ? successfulTotalCoordinationNumber / evaluatedTotalCoordinationNumber : 0;
  // involved
  const evaluatedTotalNumberInvolved = dataYearEvaluated?.total_number_involved || 0;
  const successfulTotalNumberInvolved = dataYearSuccessful?.total_number_involved || 0;
  const totalNumberInvolvedSuccessRate = evaluatedTotalNumberInvolved > 0 ? successfulTotalNumberInvolved / evaluatedTotalNumberInvolved : 0;

  let fr;
  let en;

  switch (displayType) {
    case "total_coordination_number":
      fr = (
        <>
          En <strong>{year}</strong>, le nombre de coordinations sur les projets évalués est de <strong>{evaluatedTotalCoordinationNumber}</strong>{" "}
          alors que sur les projets lauréats, celles-ci sont de <strong>{successfulTotalCoordinationNumber}</strong>. Cela représente un taux de
          succès de <strong>{formatToRates(totalCoordinationNumberSuccessRate)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the number of coordinations for evaluated projects is <strong>{evaluatedTotalCoordinationNumber}</strong>, while
          for successful projects, it is <strong>{successfulTotalCoordinationNumber}</strong>. This represents a success rate of{" "}
          <strong>{formatToRates(totalCoordinationNumberSuccessRate)}</strong>.
        </>
      );
      break;

    case "total_number_involved":
      fr = (
        <>
          En <strong>{year}</strong>, le nombre total de participants sur les projets évalués s'élèvent à{" "}
          <strong>{evaluatedTotalNumberInvolved}</strong> alors que sur les projets lauréats, celui-ci est de{" "}
          <strong>{successfulTotalNumberInvolved}</strong>. Cela représente un taux de succès de{" "}
          <strong>{formatToRates(totalNumberInvolvedSuccessRate)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the total number of participants for evaluated projects amounts to{" "}
          <strong>{evaluatedTotalNumberInvolved}</strong>, while for successful projects, it amounts to{" "}
          <strong>{successfulTotalNumberInvolved}</strong>. This represents a success rate of{" "}
          <strong>{formatToRates(totalNumberInvolvedSuccessRate)}</strong>.
        </>
      );
      break;

    default:
      fr = (
        <>
          En <strong>{year}</strong>, les subventions sur les projets évalués s'élèvent à <strong>{formatToMillions(evaluatedFunding)}</strong> alors
          que sur les projets lauréats, celles-ci sont de <strong>{formatToMillions(successfulFunding)}</strong>. Cela représente un taux de succès de{" "}
          <strong>{formatToRates(successRate)}</strong>.
        </>
      );
      en = (
        <>
          In <strong>{year}</strong>, the funding for evaluated projects amounts to <strong>{formatToMillions(evaluatedFunding)}</strong>, while for
          successful projects, it amounts to <strong>{formatToMillions(successfulFunding)}</strong>. This represents a success rate of{" "}
          <strong>{formatToRates(successRate)}</strong>.
        </>
      );
  }

  return {
    fr: fr,
    en: en,
  };
}

