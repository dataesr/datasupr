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

  // Trouver les pays avec les montants de subventions les plus élevés
  const topEvaluated = data.find((item) => item.rank_evaluated === 1);
  const topSuccessful = data.find((item) => item.rank_successful === 1);

  // Formater les montants en millions d'euros
  const formatAmount = (amount) => {
    return (amount / 1000000).toFixed(1);
  };

  return {
    fr: (
      <>
        Le pays "<strong>{topEvaluated.name_fr}</strong>" est le pays qui a demandé le montant le plus élevé de subventions pour les projets évalués (
        <strong>{formatAmount(topEvaluated.total_evaluated)} M€</strong>) tandis que le pays "<strong>{topSuccessful.name_fr}</strong>" est celui qui
        a obtenu le montant le plus élevé de subventions pour les projets réussis (<strong>{formatAmount(topSuccessful.total_successful)} M€</strong>
        ).
      </>
    ),
    en: (
      <>
        In this ranking, the country "<strong>{topEvaluated.name_en}</strong>" has requested the highest amount of subsidies for evaluated projects (
        <strong>{formatAmount(topEvaluated.total_evaluated)} M€</strong>), while the country "<strong>{topSuccessful.name_en}</strong>" has obtained
        the highest amount of subsidies for successful projects (<strong>{formatAmount(topSuccessful.total_successful)} M€</strong>).
      </>
    ),
  };
}
