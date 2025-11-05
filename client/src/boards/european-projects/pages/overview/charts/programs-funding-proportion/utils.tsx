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

  return params.join("&");
}

export function readingKey(data, isLoading) {
  if (isLoading || !data?.data || data.data.length === 0) {
    return { fr: <></>, en: <></> };
  }

  // Trouver le programme avec la plus forte proportion pour les projets lauréats (successful)
  const successfulProjects = data.data.filter((item) => item.stage === "successful");
  const topSuccessfulProgram = successfulProjects.reduce(
    (max, current) => (current.proportion > max.proportion ? current : max),
    successfulProjects[0]
  );

  // Trouver les données correspondantes pour les projets évalués
  const evaluatedData = data.data.find((item) => item.program === topSuccessfulProgram.program && item.stage === "evaluated");

  if (!topSuccessfulProgram || !evaluatedData) {
    return { fr: <></>, en: <></> };
  }

  const programNameFr = topSuccessfulProgram.programme_name_fr;
  const programNameEn = topSuccessfulProgram.programme_name_en;
  const successfulProportion = topSuccessfulProgram.proportion;
  const evaluatedProportion = evaluatedData.proportion;
  const difference = successfulProportion - evaluatedProportion;

  const fr = (
    <>
      Le programme <strong>{programNameFr}</strong> présente la plus forte proportion de financements lauréats avec{" "}
      <strong>{successfulProportion.toFixed(2)}%</strong>, contre <strong>{evaluatedProportion.toFixed(2)}%</strong> pour les projets évalués, soit
      une différence de{" "}
      <strong>
        {difference > 0 ? "+" : ""}
        {difference.toFixed(2)} points de pourcentage
      </strong>
      .
    </>
  );

  const en = (
    <>
      The <strong>{programNameEn}</strong> program shows the highest proportion of successful funding at{" "}
      <strong>{successfulProportion.toFixed(2)}%</strong>, compared to <strong>{evaluatedProportion.toFixed(2)}%</strong> for evaluated projects,
      representing a difference of{" "}
      <strong>
        {difference > 0 ? "+" : ""}
        {difference.toFixed(2)} percentage points
      </strong>
      .
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}