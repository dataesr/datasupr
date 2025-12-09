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

  const currentLang = searchParams.get("language") || "fr";

  return { params: params.join("&"), currentLang };
}

export function renderDataTable(data, currentLang) {
  if (!data) return null;

  const successRates = data.successRateByProgram || [];
  const rawData = data.data;

  const labels = {
    caption: currentLang === "fr" ? "Taux de succès par programme" : "Success rate by program",
    program: currentLang === "fr" ? "Programme" : "Program",
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
                  <th scope="col">{labels.program}</th>
                  <th scope="col">{labels.successRate}</th>
                </tr>
              </thead>
              <tbody>
                {successRates.map((item) => {
                  const programData = rawData.find((d) => d.program === item.program && d.stage === "evaluated");
                  const programName = currentLang === "fr" ? programData?.programme_name_fr : programData?.programme_name_en;

                  return (
                    <tr key={item.program}>
                      <th scope="row">{programName || item.program}</th>
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
