import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { useNavigation } from "../api/use-navigation";
import { useMemo } from "react";
import { useFacultyMembersYears } from "../api/general-queries";

interface NavigationCardsProps {
  type: "fields" | "regions" | "structures" | "academies";
  maxItems?: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  total_count: number;
  region?: string;
  region_name?: string;
}

export default function NavigationCards({
  type,
  maxItems = 20,
}: NavigationCardsProps) {
  const [searchParams] = useSearchParams();
  const selectedYearParam = searchParams.get("annee_universitaire") || "";

  const { data: yearsData, isLoading: isYearsLoading } =
    useFacultyMembersYears();
  const yearToUse = useMemo(() => {
    if (selectedYearParam) return selectedYearParam;
    if (yearsData?.academic_years?.length > 0)
      return yearsData.academic_years[0];
    return "";
  }, [selectedYearParam, yearsData]);

  const apiType = type === "academies" ? "regions" : type;

  const { data, isLoading, error } = useNavigation({
    type: apiType,
    annee_universitaire: yearToUse,
  });

  const config = useMemo(() => {
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
      case "academies":
        return {
          basePath: "/personnel-enseignant/geo/vue-d'ensemble",
          colors: [
            "#e3f2fd",
            "#fff3e0",
            "#fce4ec",
            "#f5f5fe",
            "#ede7f6",
            "#e8f5e9",
          ],
          urlParam: "geo_id",
          emptyMessage: "Aucune académie disponible",
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
  }, [type]);

  const yearDisplay =
    yearToUse || (isYearsLoading ? "chargement..." : "toutes les années");

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

  if (isLoading || isYearsLoading) {
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
            {config.emptyMessage} pour l'année {yearDisplay}
          </p>
        </div>
      </div>
    );
  }

  let filteredItems = [...data.items];
  if (type === "academies") {
    filteredItems = filteredItems.filter(
      (item) => item.id && item.id.toString().startsWith("A")
    );
  } else if (type === "regions") {
    filteredItems = filteredItems.filter(
      (item) => !item.id || !item.id.toString().startsWith("A")
    );
  }

  const displayItems = filteredItems.slice(0, maxItems);

  return (
    <div className="fr-container">
      <div
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
            params.set("annee_universitaire", yearToUse);

            switch (type) {
              case "regions":
              case "academies":
                params.set("geo_id", item.id);
                break;
              case "fields":
                params.set("field_id", item.id);
                break;
              case "structures":
                params.set("structure_id", item.id);
                break;
            }
            return `${config.basePath}?${params.toString()}`;
          };

          return (
            <Link
              key={item.id}
              href={getItemUrl()}
              title={`Voir les détails de ${
                type === "academies" ? `Académie de ${item.name}` : item.name
              } (${item.total_count.toLocaleString()} enseignants - ${yearDisplay})`}
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
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
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
                {type === "academies" ? `Académie de ${item.name}` : item.name}
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

              {type === "academies" && item.region_name && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#888888",
                    marginTop: "0.25rem",
                  }}
                >
                  Région {item.region_name}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
