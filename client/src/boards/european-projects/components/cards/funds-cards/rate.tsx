import { useId } from "react";
import { formatToRates } from "../../../../../utils/format";
import "./styles.scss";

export default function RateCard({ nb, label, loading, tooltipText }: { nb: number; label: string; loading: boolean; tooltipText?: string }) {
  const tooltipId = useId();

  return (
    <div className="ep-funds-card rate-card">
      {loading ? (
        <>
          <div className="loader-skeleton loader-label"></div>
          <div className="loader-skeleton loader-number"></div>

          <div className="part-container">
            <div className="loader-skeleton loader-part-label"></div>
            <div className="part-bar-container">
              <div className="loader-skeleton loader-part-bar"></div>
              <div className="loader-skeleton loader-percentage"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card-header">
            <p className="label">{label}</p>
            {tooltipText && (
              <div className="fr-tooltip__container">
                <button className="info-button" aria-describedby={tooltipId} type="button">
                  <span className="fr-icon-information-line" aria-hidden="true"></span>
                </button>
                <span className="fr-tooltip fr-placement" id={tooltipId} role="tooltip" aria-hidden="true">
                  {tooltipText}
                </span>
              </div>
            )}
          </div>
          <p className="nb">{formatToRates(nb)}</p>

          <div className="part-container">
            <span className="part-label">taux</span>
            <div className="part-bar-container">
              <div className="part-bar">
                <div className="part-fill" style={{ width: `${nb * 100}%` }}></div>
              </div>
              <span className="part-percentage">{formatToRates(nb)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
