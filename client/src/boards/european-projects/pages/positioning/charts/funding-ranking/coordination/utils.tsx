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

  // Prendre le premier pays de la liste
  const firstCountry = data[0];

  // Fonction pour obtenir le suffixe ordinal
  const getOrdinal = (rank, lang) => {
    if (lang === "fr") {
      return rank === 1 ? "ère" : "ème";
    }
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
  };

  return {
    fr: (
      <>
        {firstCountry.rank_coordination_number_evaluated === firstCountry.rank_coordination_number_successful ? (
          <>
            Le pays "<strong>{firstCountry.name_fr}</strong>" arrive en{" "}
            <strong>
              {firstCountry.rank_coordination_number_evaluated}
              {getOrdinal(firstCountry.rank_coordination_number_evaluated, "fr")}
            </strong>{" "}
            position pour le nombre de coordinations évaluées (<strong>{firstCountry.total_coordination_number_evaluated}</strong>) ainsi que pour les
            coordinations réussies (<strong>{firstCountry.total_coordination_number_successful}</strong>). Son taux de succès est de{" "}
            <strong>{firstCountry.ratio_coordination_number.toFixed(1)}%</strong>.
          </>
        ) : (
          <>
            Le pays "<strong>{firstCountry.name_fr}</strong>" arrive en{" "}
            <strong>
              {firstCountry.rank_coordination_number_evaluated}
              {getOrdinal(firstCountry.rank_coordination_number_evaluated, "fr")}
            </strong>{" "}
            position pour le nombre de coordinations évaluées (<strong>{firstCountry.total_coordination_number_evaluated}</strong>) alors qu'il arrive
            en{" "}
            <strong>
              {firstCountry.rank_coordination_number_successful}
              {getOrdinal(firstCountry.rank_coordination_number_successful, "fr")}
            </strong>{" "}
            position pour les coordinations réussies (<strong>{firstCountry.total_coordination_number_successful}</strong>). Le taux de succès est de{" "}
            <strong>{firstCountry.ratio_coordination_number.toFixed(1)}%</strong>.
          </>
        )}
      </>
    ),
    en: (
      <>
        {firstCountry.rank_coordination_number_evaluated === firstCountry.rank_coordination_number_successful ? (
          <>
            The country "<strong>{firstCountry.name_en}</strong>" ranks{" "}
            <strong>
              {firstCountry.rank_coordination_number_evaluated}
              {getOrdinal(firstCountry.rank_coordination_number_evaluated, "en")}
            </strong>{" "}
            for the number of evaluated coordinations (<strong>{firstCountry.total_coordination_number_evaluated}</strong>) as well as for successful
            coordinations (<strong>{firstCountry.total_coordination_number_successful}</strong>). Its success rate is{" "}
            <strong>{firstCountry.ratio_coordination_number.toFixed(1)}%</strong>.
          </>
        ) : (
          <>
            The country "<strong>{firstCountry.name_en}</strong>" ranks{" "}
            <strong>
              {firstCountry.rank_coordination_number_evaluated}
              {getOrdinal(firstCountry.rank_coordination_number_evaluated, "en")}
            </strong>{" "}
            for the number of evaluated coordinations (<strong>{firstCountry.total_coordination_number_evaluated}</strong>) while it ranks{" "}
            <strong>
              {firstCountry.rank_coordination_number_successful}
              {getOrdinal(firstCountry.rank_coordination_number_successful, "en")}
            </strong>{" "}
            for successful coordinations (<strong>{firstCountry.total_coordination_number_successful}</strong>). The success rate is{" "}
            <strong>{firstCountry.ratio_coordination_number.toFixed(1)}%</strong>.
          </>
        )}
      </>
    ),
  };
}