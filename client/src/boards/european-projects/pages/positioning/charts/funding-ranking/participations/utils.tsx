import { useSearchParams } from "react-router-dom";

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

  // Trouver les pays avec le nombre de participants le plus élevé
  const topEvaluated = data.find((item) => item.rank_involved_evaluated === 1);
  const topSuccessful = data.find((item) => item.rank_involved_successful === 1);

  return {
    fr: (
      <>
        Le pays "<strong>{topEvaluated.name_fr}</strong>" est le pays qui a le plus grand nombre de participants impliqués dans les projets évalués (
        <strong>{topEvaluated.total_number_involved_evaluated}</strong>) tandis que le pays "<strong>{topSuccessful.name_fr}</strong>" est celui qui a
        le plus grand nombre de participants impliqués dans les projets réussis (<strong>{topSuccessful.total_number_involved_successful}</strong>).
      </>
    ),
    en: (
      <>
        In this ranking, the country "<strong>{topEvaluated.name_en}</strong>" has the highest number of participants involved in evaluated projects (
        <strong>{topEvaluated.total_number_involved_evaluated}</strong>), while the country "<strong>{topSuccessful.name_en}</strong>" has the highest
        number of participants involved in successful projects (<strong>{topSuccessful.total_number_involved_successful}</strong>).
      </>
    ),
  };
}
