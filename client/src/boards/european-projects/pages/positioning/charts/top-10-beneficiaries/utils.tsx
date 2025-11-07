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

  // Ajouter le paramètre stage par défaut
  params.push("stage=successful");

  return params.join("&");
}

export function readingKey(data) {
  if (!data?.top10 || data.top10.length === 0) {
    return {
      fr: <></>,
      en: <></>,
    };
  }

  const topCountry = data.top10[0];
  const secondCountry = data.top10.length > 1 ? data.top10[1] : null;
  const tenthCountry = data.top10.length >= 10 ? data.top10[9] : data.top10[data.top10.length - 1];

  return {
    fr: (
      <>
        Le pays "{topCountry.name_fr}" se place en 1ère position du classement avec <strong>{formatToMillions(topCountry.total_fund_eur)}</strong> de
        subventions reçues
        {secondCountry && (
          <>
            , suivi par "{secondCountry.name_fr}" avec <strong>{formatToMillions(secondCountry.total_fund_eur)}</strong>
          </>
        )}
        . {data.top10.length >= 10 ? "Les 10 premiers" : `Les ${data.top10.length}`} bénéficiaires représentent{" "}
        <strong>{tenthCountry.influence?.toFixed(1)}%</strong> du cumul total des subventions allouées.
      </>
    ),
    en: (
      <>
        The country "{topCountry.name_en}" ranks 1st with <strong>{formatToMillions(topCountry.total_fund_eur)}</strong> in subsidies received
        {secondCountry && (
          <>
            , followed by "{secondCountry.name_en}" with <strong>{formatToMillions(secondCountry.total_fund_eur)}</strong>
          </>
        )}
        . The top {data.top10.length >= 10 ? "10" : data.top10.length} beneficiaries represent <strong>{tenthCountry.influence?.toFixed(1)}%</strong>{" "}
        of the cumulative total subsidies allocated.
      </>
    ),
  };
}