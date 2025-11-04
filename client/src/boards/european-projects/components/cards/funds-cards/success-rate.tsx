import { useSearchParams } from "react-router-dom";

import { formatToRates } from "../../../../../utils/format";

import i18n from "../../../i18n-global.json";
import "./styles.scss";

export default function SuccessRateCard({ nb, loading }: { nb: number; loading: boolean }) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }
  return (
    <div className="ep-funds-card success-rate-card rate-card">
      {loading ? (
        <>
          <div className="loader-skeleton loader-number"></div>
          <div className="loader-skeleton loader-label"></div>
          <div className="loader-skeleton loader-bottom-bar"></div>
        </>
      ) : (
        <>
          <div className="card-content">
            <div className="card-header">
              <p className="label">
                {getI18nLabel("success-rate")}
                <span style={{ fontSize: "0.8rem", fontWeight: "normal", fontStyle: "normal" }}>
                  <span className="fr-icon-information-line fr-mr-1w" aria-hidden="true" />
                  {getI18nLabel("success-rate-info")}
                </span>
              </p>
            </div>
            <p className="nb">{formatToRates(nb)}</p>
          </div>

          <div className="bottom-progress-bar">
            <div className="progress-fill" style={{ width: `${nb * 100}%` }}></div>
          </div>
        </>
      )}
    </div>
  );
}
