import { useQuery } from "@tanstack/react-query";
import { getErcSynthesisByDestination, ErcDestinationData } from "../../../api/erc";
import { formatNumber, formatToRates } from "../../../../../utils/format";
import "./styles.scss";

// Mapping des codes de destination vers des noms lisibles
const DESTINATION_NAMES: Record<string, string> = {
  STG: "Starting Grants",
  COG: "Consolidator Grants",
  ADG: "Advanced Grants",
  SYG: "Synergy Grants",
  POC: "Proof of Concept",
};

interface ErcDestinationCardsProps {
  countryCode?: string;
  callYear?: string;
  framework?: string;
}

export default function ErcDestinationCards({ countryCode, callYear, framework }: ErcDestinationCardsProps) {
  const { data, isLoading } = useQuery<ErcDestinationData[]>({
    queryKey: ["erc-synthesis-by-destination", countryCode, callYear, framework],
    queryFn: () =>
      getErcSynthesisByDestination({
        country_code: countryCode,
        call_year: callYear,
        framework,
      }),
  });

  if (isLoading) {
    return (
      <div className="erc-destination-section">
        <h3>Par type de financement</h3>
        <div className="erc-destination-cards">
          {[1, 2, 3, 4, 5].map((i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="erc-destination-section">
      <h3>Par type de financement</h3>
      <div className="erc-destination-cards">
        {data.map((destination) => (
          <DestinationCard key={destination.destination_code} data={destination} />
        ))}
      </div>
    </div>
  );
}

interface DestinationCardProps {
  data: ErcDestinationData;
}

function DestinationCard({ data }: DestinationCardProps) {
  const evaluatedProjects = data.evaluated?.total_involved || 0;
  const successfulProjects = data.successful?.total_involved || 0;
  const successRate = evaluatedProjects > 0 ? successfulProjects / evaluatedProjects : 0;

  const displayName = DESTINATION_NAMES[data.destination_code] || data.destination_name_en || data.destination_code;

  return (
    <div className="erc-destination-card">
      <div className="destination-header">
        <h4 className="destination-title">{displayName}</h4>
        <span className="destination-code">{data.destination_code}</span>
      </div>

      <div className="destination-stats">
        <div className="stat-group evaluated">
          <div className="stat-label">Projets évalués</div>
          <div className="stat-value">{formatNumber(evaluatedProjects)}</div>
        </div>

        <div className="stat-group successful">
          <div className="stat-label">Projets lauréats</div>
          <div className="stat-value">{formatNumber(successfulProjects)}</div>
        </div>
      </div>

      <div className="success-rate">
        <span className="rate-label">Taux de succès</span>
        <span className="rate-value">{formatToRates(successRate)}</span>
      </div>
    </div>
  );
}

function DestinationCardSkeleton() {
  return (
    <div className="erc-destination-card">
      <div className="destination-header">
        <div className="loader-skeleton" style={{ width: "60%", height: "1rem" }}></div>
        <div className="loader-skeleton" style={{ width: "3rem", height: "1.5rem" }}></div>
      </div>

      <div className="destination-stats">
        <div className="stat-group">
          <div className="loader-skeleton" style={{ width: "80%", height: "0.75rem", marginBottom: "0.25rem" }}></div>
          <div className="loader-skeleton" style={{ width: "50%", height: "1.5rem" }}></div>
        </div>
        <div className="stat-group">
          <div className="loader-skeleton" style={{ width: "80%", height: "0.75rem", marginBottom: "0.25rem" }}></div>
          <div className="loader-skeleton" style={{ width: "50%", height: "1.5rem" }}></div>
        </div>
      </div>

      <div className="success-rate">
        <div className="loader-skeleton" style={{ width: "40%", height: "0.875rem" }}></div>
        <div className="loader-skeleton" style={{ width: "20%", height: "1.25rem" }}></div>
      </div>
    </div>
  );
}
