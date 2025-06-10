import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { useNavigation } from "../api/use-navigation";

interface NavigationCardsProps {
  type: "fields" | "regions" | "structures";
  maxItems?: number;
}

export default function NavigationCards({
  type,
  maxItems = 20,
}: NavigationCardsProps) {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { data, isLoading, error } = useNavigation({
    type,
    annee_universitaire: selectedYear,
  });

  const getConfig = () => {
    switch (type) {
      case "fields":
        return {
          basePath: "/personnel-enseignant/discipline/vue-d'ensemble",
          colors: [
            "#f5f5fe",
            "#e3f2fd",
            "#ede7f6",
            "#e8f5e9",
            "#fff3e0",
            "#fce4ec",
          ],
          urlParam: "field_id",
          emptyMessage: "Aucune discipline disponible",
        };
      case "regions":
        return {
          basePath: "/personnel-enseignant/geo/vue-d'ensemble",
          colors: [
            "#e8f5e9",
            "#e3f2fd",
            "#fff3e0",
            "#fce4ec",
            "#f5f5fe",
            "#ede7f6",
          ],
          urlParam: "geo_id",
          emptyMessage: "Aucune région disponible",
        };
      case "structures":
        return {
          basePath: "/personnel-enseignant/universite/vue-d'ensemble",
          colors: [
            "#fff3e0",
            "#fce4ec",
            "#e8f5e9",
            "#e3f2fd",
            "#ede7f6",
            "#f5f5fe",
          ],
          urlParam: "structure_id",
          emptyMessage: "Aucun établissement disponible",
        };
    }
  };

  const config = getConfig();

  const LoadingSkeleton = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1rem",
      }}
    >
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: "12px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            minHeight: "100px",
            animation: "pulse 2s infinite",
          }}
        >
          <div
            style={{
              backgroundColor: "#e0e0e0",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              backgroundColor: "#e0e0e0",
              height: "16px",
              width: "80%",
              borderRadius: "4px",
            }}
          />
        </div>
      ))}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );

  if (isLoading) {
    return (
      <div className="fr-container">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-container">
        <div className="fr-alert fr-alert--error fr-alert--sm">
          <p>Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="fr-container">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>
            {config.emptyMessage} pour l'année {selectedYear}
          </p>
        </div>
      </div>
    );
  }

  const displayItems = data.items.slice(0, maxItems);

  return (
    <div
      className="fr-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1rem",
      }}
    >
      {displayItems.map((item, idx) => {
        const color = config.colors[idx % config.colors.length];
        const initial = item.name.charAt(0).toUpperCase();

        const getItemUrl = () => {
          const params = new URLSearchParams();
          if (selectedYear) params.set("annee_universitaire", selectedYear);

          switch (type) {
            case "regions":
              params.set("geo_id", item.id);
              return `${config.basePath}?${params.toString()}`;

            case "fields":
              params.set("field_id", item.id);
              return `${config.basePath}?${params.toString()}`;

            case "structures":
              params.set("structure_id", item.id);
              return `${config.basePath}?${params.toString()}`;

            default:
              return config.basePath;
          }
        };

        return (
          <Link
            key={item.id}
            href={getItemUrl()}
            title={`Voir les détails de ${
              item.name
            } (${item.total_count.toLocaleString()} enseignants)`}
            style={{
              backgroundColor: color,
              borderRadius: "12px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#000091",
                marginBottom: "0.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {initial}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#1e1e1e",
                marginBottom: "0.25rem",
                lineHeight: "1.3",
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#666666",
                fontWeight: "500",
              }}
            >
              {item.total_count.toLocaleString()} enseignants
            </div>

            {type === "structures" && item.region && (
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#888888",
                  marginTop: "0.25rem",
                }}
              >
                {item.region}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
