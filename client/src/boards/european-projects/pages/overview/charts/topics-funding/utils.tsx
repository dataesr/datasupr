import { useSearchParams } from "react-router-dom";
import { formatToMillions } from "../../../../../../utils/format";

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

  const currentLang = searchParams.get("language") || "fr";

  return { params: params.join("&"), currentLang };
}

export function renderDataTable(data, currentLang) {
  if (!data) return null;

  const rawData = data.data;
  const evaluatedData = rawData.filter((item) => item.stage === "evaluated");
  const successfulData = rawData.filter((item) => item.stage === "successful");

  const labels = {
    caption: currentLang === "fr" ? "Suventions par thématique" : "Funding by topic",
    topic: currentLang === "fr" ? "Thématique" : "Topic",
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
                  <th scope="col">{labels.topic}</th>
                  <th scope="col">{labels.evaluated}</th>
                  <th scope="col">{labels.successful}</th>
                </tr>
              </thead>
              <tbody>
                {evaluatedData.map((evalItem) => {
                  const topicName = currentLang === "fr" ? evalItem.thema_name_fr : evalItem.thema_name_en;
                  const successItem = successfulData.find((item) => item.topic === evalItem.topic);

                  const evaluatedValue = evalItem.total_fund_eur || 0;
                  const successfulValue = successItem?.total_fund_eur || 0;

                  return (
                    <tr key={evalItem.thema}>
                      <th scope="row">{topicName}</th>
                      <td>{formatToMillions(evaluatedValue)}</td>
                      <td>{formatToMillions(successfulValue)}</td>
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
