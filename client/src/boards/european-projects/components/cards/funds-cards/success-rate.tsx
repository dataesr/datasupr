import { formatToRates } from "../../../../../utils/format";
import "./styles.scss";

export default function SuccessRateCard({ nb, loading }: { nb: number; loading: boolean }) {
  return (
    <div className="ep-funds-card success-rate-card">
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
          <p className="label">Taux de succès</p>
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
