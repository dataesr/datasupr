import { useSearchParams } from "react-router-dom";
import { formatToRates } from "../../../../../../utils/format";

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

  const successRates = data.successRateByDestination || [];

  const labels = {
    caption: currentLang === "fr" ? "Taux de succès par destination" : "Success rate by destination",
    destination: currentLang === "fr" ? "Destination" : "Destination",
    successRate: currentLang === "fr" ? "Taux de succès" : "Success rate",
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
                  <th scope="col">{labels.successRate}</th>
                </tr>
              </thead>
              <tbody>
                {successRates.map((item) => {
                  const destinationName = item.destination;

                  return (
                    <tr key={item.destination}>
                      <th scope="row">{destinationName}</th>
                      <td>{formatToRates(item.successRate)}</td>
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
