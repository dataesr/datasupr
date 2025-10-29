import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { useNavigation } from "../../api/use-navigation";
import { useMemo } from "react";
import { useFacultyMembersYears } from "../../api/general-queries";
import "./navigation-cards.scss";
import { NavigationCardsProps } from "../../../../types/faculty-members";

export default function NavigationCards({
  type,
  maxItems = 20,
}: NavigationCardsProps) {
  const [searchParams] = useSearchParams();

  const { data: yearsData, isLoading: isYearsLoading } =
    useFacultyMembersYears();
  const yearToUse = useMemo(() => {
    const paramYear = searchParams.get("annee_universitaire");
    if (paramYear) return paramYear;
    return (
      yearsData?.complete_years?.[0] || yearsData?.available_years?.[0] || ""
    );
  }, [searchParams, yearsData]);

  const { data, isLoading, error } = useNavigation({
    type: type,
    annee_universitaire: yearToUse,
  });

  const config = useMemo(() => {
    switch (type) {
      case "fields":
        return {
          basePath: "/personnel-enseignant/discipline/vue-d'ensemble",
          colors: [
            "var(--purple-glycine-975)",
            "var(--blue-cumulus-975)",
            "var(--purple-glycine-950)",
            "var(--green-emeraude-975)",
            "var(--yellow-moutarde-975)",
            "var(--pink-macaron-975)",
          ],
          emptyMessage: "Aucune discipline disponible",
        };
      case "regions":
        return {
          basePath: "/personnel-enseignant/geo/vue-d'ensemble",
          colors: [
            "var(--green-emeraude-975)",
            "var(--blue-cumulus-975)",
            "var(--yellow-moutarde-975)",
            "var(--pink-macaron-975)",
            "var(--purple-glycine-975)",
            "var(--purple-glycine-950)",
          ],
          emptyMessage: "Aucune région disponible",
        };
      case "structures":
        return {
          basePath: "/personnel-enseignant/universite/vue-d'ensemble",
          colors: [
            "var(--yellow-moutarde-975)",
            "var(--pink-macaron-975)",
            "var(--green-emeraude-975)",
            "var(--blue-cumulus-975)",
            "var(--purple-glycine-950)",
            "var(--purple-glycine-975)",
          ],
          emptyMessage: "Aucun établissement disponible",
        };
    }
  }, [type]);

  const yearDisplay =
    yearToUse || (isYearsLoading ? "chargement..." : "toutes les années");

  const LoadingSkeleton = () => (
    <div className="loading-skeleton">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="skeleton-item">
          <div className="skeleton-avatar" />
          <div className="skeleton-text" />
        </div>
      ))}
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

  const displayItems = data.items.slice(0, maxItems);

  return (
    <div className="fr-container">
      <div className="navigation-cards-container">
        {displayItems.map((item, idx) => {
          const color = config.colors[idx % config.colors.length];

          const paramMap: Record<string, string> = {
            fields: "field_id",
            regions: "geo_id",
            structures: "structure_id",
          };

          const getItemUrl = () => {
            const params = new URLSearchParams();
            params.set("annee_universitaire", yearToUse);
            params.set(paramMap[type], item.id);
            return `${config.basePath}?${params.toString()}`;
          };

          return (
            <Link
              key={item.id}
              href={getItemUrl()}
              className="navigation-card"
              style={{ backgroundColor: color }}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <div className="navigation-card__title">{item.name}</div>
              <div className="navigation-card__count">
                {item.total_count.toLocaleString()} enseignants
              </div>

              {type === "structures" && item.region && (
                <div className="navigation-card__meta">{item.region}</div>
              )}
              <div className="navigation-card__year">
                <i>{yearDisplay}</i>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
