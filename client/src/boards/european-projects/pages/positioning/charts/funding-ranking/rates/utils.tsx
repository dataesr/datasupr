import { useSearchParams } from "react-router-dom";
// import { formatToMillions } from "../../../../../../../utils/format";

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params: string[] = [];

  // Récupérer le paramètre country_code s'il existe
  const countryCode = searchParams.get("country_code");
  if (countryCode) {
    params.push(`country_code=${countryCode}`);
  }

  // Récupérer le paramètre pillarId et l'ajouter comme pillars s'il existe
  const pillarId = searchParams.get("pillarId");
  if (pillarId) {
    params.push(`pillars=${pillarId}`);
  }

  // Récupérer le paramètre programId et l'ajouter comme programs s'il existe
  const programId = searchParams.get("programId");
  if (programId) {
    params.push(`programs=${programId}`);
  }

  // Récupérer le paramètre thematicIds et l'ajouter comme thematics s'il existe
  const thematicIds = searchParams.get("thematicIds");
  if (thematicIds) {
    params.push(`thematics=${thematicIds}`);
  }

  // Récupérer le paramètre destinationIds et l'ajouter comme destinations s'il existe
  const destinationIds = searchParams.get("destinationIds");
  if (destinationIds) {
    params.push(`destinations=${destinationIds}`);
  }

  return params.join("&");
}

export function readingKey(data) {
  if (!data || data.length === 0) {
    return {
      fr: <></>,
      en: <></>,
    };
  }

  // Trouver les pays avec les parts les plus élevées
  const topEvaluated = [...data].sort((a, b) => b.total_evaluated_ratio - a.total_evaluated_ratio)[0];
  const topSuccessful = [...data].sort((a, b) => b.total_successful_ratio - a.total_successful_ratio)[0];

  return {
    fr: (
      <>
        Dans ce classement, le pays "<strong>{topEvaluated.name_fr}</strong>" concentre la plus grande part des montants demandés (
        {topEvaluated.total_evaluated_ratio}%), tandis que le pays "<strong>{topSuccessful.name_fr}</strong>" obtient la plus grande part des montants
        accordés ({topSuccessful.total_successful_ratio}%).
      </>
    ),
    en: (
      <>
        In this ranking, <strong>{topSuccessful.name_en}</strong> concentrates the largest share of requested amounts (
        {topEvaluated.total_evaluated_ratio}%), while <strong>{topSuccessful.name_en}</strong> obtains the largest share of awarded amounts (
        {topSuccessful.total_successful_ratio}%).
      </>
    ),
  };
}