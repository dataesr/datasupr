import { formatToPercent } from "../../../../../utils/format";
import "./styles.scss";

export default function EvaluatedCard({
  fund,
  loading,
  loadingPart,
  nb,
  part,
}: {
  fund: string;
  loading: boolean;
  loadingPart: boolean;
  nb: number;
  part: number;
}) {
  return (
    <div className="ep-funds-card evaluated-card">
      {loading ? (
        <>
          <div className="loader-skeleton loader-number"></div>
          <div className="loader-skeleton loader-label"></div>
          <div className="loader-skeleton loader-funds fr-mt-3w"></div>
          <div className="loader-skeleton loader-funds-label"></div>
        </>
      ) : (
        <>
          <span className="nb">
            {nb}
            <span className="label fr-ml-1w">projets évalués</span>
          </span>

          <p className="funds fr-mt-3w">
            {fund}
            <span className="label fr-ml-1w">demandés</span>
          </p>
        </>
      )}

      <div className="part-container">
        {loadingPart ? (
          <>
            <div className="loader-skeleton loader-part-label"></div>
            <div className="part-bar-container">
              <div className="loader-skeleton loader-part-bar"></div>
              <div className="loader-skeleton loader-percentage"></div>
            </div>
          </>
        ) : (
          <>
            <span className="part-label">part</span>
            <div className="part-bar-container">
              <div className="part-bar">
                <div className="part-fill" style={{ width: `${part}%` }}></div>
              </div>
              <span className="part-percentage">{formatToPercent(part)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
