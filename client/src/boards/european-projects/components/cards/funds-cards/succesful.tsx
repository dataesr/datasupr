import "./styles.scss";

export default function SuccessfulCard({ nb, fund, loading }: { nb: number; fund: string; loading: boolean }) {
  return (
    <div className="ep-funds-card successful-card">
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
            <span className="label fr-ml-1w">projets lauréats</span>
          </span>

          <p className="funds fr-mt-2w">
            {fund}
            <span className="label fr-ml-1w">obtenus</span>
          </p>

          <div className="bottom-progress-bar">
            <div className="progress-fill" />
          </div>
        </>
      )}
    </div>
  );
}
