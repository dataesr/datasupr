import { formatNumber, formatToRates, formatCurrency } from "../../../../../utils/format";
import "./styles.scss";

export type ViewMode = "projects" | "funding";

export interface ErcStatCardData {
  title: string;
  code: string;
  subtitle?: string;
  evaluatedCount: number;
  successfulCount: number;
  fundingAmount: number;
  piCount: number;
}

interface ErcStatCardProps {
  data: ErcStatCardData;
  viewMode: ViewMode;
  accentColor?: string;
  badgeColor?: string;
}

export function ErcStatCard({ data, viewMode, accentColor, badgeColor }: ErcStatCardProps) {
  const successRate = data.evaluatedCount > 0 ? data.successfulCount / data.evaluatedCount : 0;

  const badgeStyle = badgeColor ? { backgroundColor: `${badgeColor}20`, color: badgeColor } : undefined;

  return (
    <div className="erc-stat-card" style={accentColor ? { borderTopColor: accentColor } : undefined}>
      <div className="stat-card-header">
        <h4 className="stat-card-title">{data.title}</h4>
        <span className="stat-card-code" style={badgeStyle}>
          {data.code}
        </span>
      </div>

      {data.subtitle && <p className="stat-card-subtitle">{data.subtitle}</p>}

      {viewMode === "projects" ? (
        <>
          <div className="stat-card-stats">
            <div className="stat-group evaluated">
              <div className="stat-label">Projets évalués</div>
              <div className="stat-value">{formatNumber(data.evaluatedCount)}</div>
            </div>

            <div className="stat-group successful">
              <div className="stat-label">Projets lauréats</div>
              <div className="stat-value">{formatNumber(data.successfulCount)}</div>
            </div>
          </div>

          <div className="success-rate">
            <span className="rate-label">Taux de succès</span>
            <span className="rate-value">{formatToRates(successRate)}</span>
          </div>
        </>
      ) : (
        <div className="stat-card-stats">
          <div className="stat-group">
            <div className="stat-label">Chercheurs PI</div>
            <div className="stat-value">{formatNumber(data.piCount)}</div>
          </div>

          <div className="stat-group">
            <div className="stat-label">Financement</div>
            <div className="stat-value funding">{formatCurrency(data.fundingAmount)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ErcStatCardSkeleton({ hasSubtitle = false }: { hasSubtitle?: boolean }) {
  return (
    <div className="erc-stat-card">
      <div className="stat-card-header">
        <div className="loader-skeleton" style={{ width: "60%", height: "1rem" }}></div>
        <div className="loader-skeleton" style={{ width: "3rem", height: "1.5rem" }}></div>
      </div>

      {hasSubtitle && <div className="loader-skeleton" style={{ width: "90%", height: "0.875rem", marginBottom: "1rem" }}></div>}

      <div className="stat-card-stats">
        <div className="stat-group">
          <div className="loader-skeleton" style={{ width: "80%", height: "0.75rem", marginBottom: "0.25rem" }}></div>
          <div className="loader-skeleton" style={{ width: "50%", height: "1.5rem" }}></div>
        </div>
        <div className="stat-group">
          <div className="loader-skeleton" style={{ width: "80%", height: "0.75rem", marginBottom: "0.25rem" }}></div>
          <div className="loader-skeleton" style={{ width: "50%", height: "1.5rem" }}></div>
        </div>
      </div>
    </div>
  );
}
