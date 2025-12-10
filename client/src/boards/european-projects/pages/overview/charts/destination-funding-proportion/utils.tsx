import { useSearchParams } from "react-router-dom";
import { formatToPercent } from "../../../../../../utils/format";

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

  // Récupérer le paramètre thematicIds et l'ajouter comme topics s'il existe
  const thematicIds = searchParams.get("thematicIds");
  if (thematicIds) {
    params.push(`thematics=${thematicIds}`);
  }

  const currentLang = searchParams.get("language") || "fr";

  return { params: params.join("&"), currentLang };
}

export function renderDataTable(data, currentLang) {
  if (!data) return null;

  const rawData = data.data;
  const evaluatedData = rawData.filter((item) => item.stage === "evaluated");
  const successfulData = rawData.filter((item) => item.stage === "successful");

  const labels = {
    caption:
      currentLang === "fr" ? "Part des financements demandés et obtenus par le pays" : "Percentage of funding requested and obtained by the country",
    destination: currentLang === "fr" ? "Destination" : "Destination",
    evaluated: currentLang === "fr" ? "Évalués" : "Evaluated",
    successful: currentLang === "fr" ? "Lauréats" : "Successful",
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
                  <th scope="col">{labels.destination}</th>
                  <th scope="col">{labels.evaluated}</th>
                  <th scope="col">{labels.successful}</th>
                </tr>
              </thead>
              <tbody>
                {evaluatedData.map((evalItem) => {
                  const destinationName = evalItem.destination;
                  const successItem = successfulData.find((item) => item.destination === evalItem.destination);

                  const evaluatedProportion = evalItem.proportion || 0;
                  const successfulProportion = successItem?.proportion || 0;

                  return (
                    <tr key={evalItem.destination}>
                      <th scope="row">{destinationName}</th>
                      <td>{formatToPercent(evaluatedProportion)}</td>
                      <td>{formatToPercent(successfulProportion)}</td>
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
