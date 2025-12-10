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

export function renderDataTable(data, currentLang, selectedCountryCode) {
  if (!data || data.length === 0) return null;

  const labels = {
    caption:
      currentLang === "fr"
        ? "Classement des pays selon la part des montants demandés et obtenus"
        : "Ranking of countries by share of amounts requested and obtained",
    position: currentLang === "fr" ? "Position" : "Position",
    country: currentLang === "fr" ? "Pays" : "Country",
    ratioEvaluated: currentLang === "fr" ? "Part demandée (%)" : "Share requested (%)",
    rankEvaluated: currentLang === "fr" ? "Rang (demandés)" : "Rank (requested)",
    ratioSuccessful: currentLang === "fr" ? "Part obtenue (%)" : "Share obtained (%)",
    rankSuccessful: currentLang === "fr" ? "Rang (obtenus)" : "Rank (obtained)",
  };

  return (
    <div className="fr-table fr-table--bordered fr-table--sm">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption className="fr-sr-only">{labels.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{labels.position}</th>
                  <th scope="col">{labels.country}</th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    {labels.ratioEvaluated}
                  </th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    {labels.rankEvaluated}
                  </th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    {labels.ratioSuccessful}
                  </th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    {labels.rankSuccessful}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const countryName = currentLang === "fr" ? item.name_fr : item.name_en;
                  const isSelectedCountry = item.id === selectedCountryCode;

                  return (
                    <tr
                      key={item.id}
                      style={isSelectedCountry ? { fontWeight: "bold" } : undefined}
                      aria-current={isSelectedCountry ? "true" : undefined}
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{countryName}</td>
                      <td style={{ textAlign: "right" }}>{item.total_evaluated_ratio} %</td>
                      <td style={{ textAlign: "right" }}>{item.rank_evaluated}e</td>
                      <td style={{ textAlign: "right" }}>{item.total_successful_ratio} %</td>
                      <td style={{ textAlign: "right" }}>{item.rank_successful}e</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
