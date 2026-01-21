import { Row, Col, Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { useFinanceYears } from "../../../api/common";
import { useFinanceAdvancedComparison } from "../api";
import { useNationalFilters } from "../hooks/useNationalFilters";
import CustomBreadcrumb from "../../../../../components/custom-breadcrumb";
import Dropdown from "../../../../../components/dropdown";
import navigationConfig from "../../../navigation-config.json";

export default function NationalSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const hasInitializedType = useRef(false);

  const defaultYear = "2024";

  const yearFromUrl = searchParams.get("year") || "";
  const selectedYear = yearFromUrl || defaultYear;
  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";

  // Nettoyer les paramètres non pertinents pour la vue nationale
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let hasChanges = false;

    // Retirer les paramètres spécifiques à la vue établissements
    if (searchParams.has("structureId")) {
      next.delete("structureId");
      hasChanges = true;
    }
    if (searchParams.has("section")) {
      next.delete("section");
      hasChanges = true;
    }
    if (searchParams.get("type") === "tous") {
      next.delete("type");
      hasChanges = true;
    }
    if (searchParams.get("region") === "toutes") {
      next.delete("region");
      hasChanges = true;
    }
    if (searchParams.get("typologie") === "toutes") {
      next.delete("typologie");
      hasChanges = true;
    }

    if (hasChanges) {
      setSearchParams(next, { replace: true });
    }
  }, []);

  const { data: comparisonData } = useFinanceAdvancedComparison(
    {
      annee: String(selectedYear),
      type: "",
      typologie: "",
      region: "",
    },
    !!selectedYear
  );

  const allItems = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];
    return comparisonData.items;
  }, [comparisonData]);

  const { availableTypes, availableTypologies, availableRegions } =
    useNationalFilters(
      allItems,
      selectedType,
      selectedTypologie,
      selectedRegion
    );

  useEffect(() => {
    if (!years.length) return;
    const yearsStr = years.map(String);

    if (yearFromUrl && yearsStr.includes(yearFromUrl)) {
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set("year", defaultYear);
    setSearchParams(next);
  }, [years, yearFromUrl, searchParams, setSearchParams, defaultYear]);

  useEffect(() => {
    if (availableTypes.length && !selectedType && !hasInitializedType.current) {
      hasInitializedType.current = true;
      const universiteType = availableTypes.find(
        (t) =>
          t.toLowerCase().includes("université") ||
          t.toLowerCase().includes("universite")
      );
      const typeToSet = universiteType || availableTypes[0];
      const next = new URLSearchParams(searchParams);
      next.set("type", typeToSet);
      setSearchParams(next);
    }
  }, [availableTypes, selectedType, setSearchParams]);

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", year);
    setSearchParams(next);
  };

  const handleTypeChange = (type: string) => {
    const next = new URLSearchParams(searchParams);
    if (type) {
      next.set("type", type);
    } else {
      next.delete("type");
    }
    next.delete("typologie");
    next.delete("region");
    setSearchParams(next);
  };

  const handleTypologieChange = (typologie: string) => {
    const next = new URLSearchParams(searchParams);
    if (typologie) {
      next.set("typologie", typologie);
    } else {
      next.delete("typologie");
    }
    setSearchParams(next);
  };

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    if (region) {
      next.set("region", region);
    } else {
      next.delete("region");
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("type");
    next.delete("typologie");
    next.delete("region");
    hasInitializedType.current = false;
    setSearchParams(next);
  };

  const hasActiveFilters = selectedType || selectedTypologie || selectedRegion;

  const typeLabel = selectedType || "Tous les types";
  const typologieLabel = selectedTypologie || "Toutes";
  const regionLabel = selectedRegion || "Toutes";

  const filterCards = [
    {
      icon: "calendar-line",
      title: "Exercice",
      value: selectedYear,
      color: "var(--background-contrast-purple-glycine)",
      iconColor: "var(--text-label-purple-glycine)",
      dropdown: (
        <Dropdown label={selectedYear} size="sm" fullWidth>
          {years.map((year) => (
            <button
              key={year}
              className={`fx-dropdown__item ${selectedYear === String(year) ? "fx-dropdown__item--active" : ""}`}
              onClick={() => handleYearChange(String(year))}
            >
              {year}
            </button>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "building-line",
      title: "Type",
      value: typeLabel,
      color: "var(--background-contrast-blue-ecume)",
      iconColor: "var(--text-label-blue-ecume)",
      dropdown: (
        <Dropdown label={typeLabel} size="sm" fullWidth>
          <button
            className={`fx-dropdown__item ${!selectedType ? "fx-dropdown__item--active" : ""}`}
            onClick={() => handleTypeChange("")}
          >
            Tous les types
          </button>
          {availableTypes.map((type: string) => (
            <button
              key={type}
              className={`fx-dropdown__item ${selectedType === type ? "fx-dropdown__item--active" : ""}`}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "layout-grid-line",
      title: "Typologie",
      value: typologieLabel,
      color: "var(--background-contrast-green-emeraude)",
      iconColor: "var(--text-label-green-emeraude)",
      dropdown: (
        <Dropdown label={typologieLabel} size="sm" fullWidth>
          <button
            className={`fx-dropdown__item ${!selectedTypologie ? "fx-dropdown__item--active" : ""}`}
            onClick={() => handleTypologieChange("")}
          >
            Toutes les typologies
          </button>
          {availableTypologies.map((typo: string) => (
            <button
              key={typo}
              className={`fx-dropdown__item ${selectedTypologie === typo ? "fx-dropdown__item--active" : ""}`}
              onClick={() => handleTypologieChange(typo)}
            >
              {typo}
            </button>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "map-pin-2-line",
      title: "Région",
      value: regionLabel,
      color: "var(--background-contrast-orange-terre-battue)",
      iconColor: "var(--text-label-orange-terre-battue)",
      dropdown: (
        <Dropdown label={regionLabel} size="sm" fullWidth>
          <button
            className={`fx-dropdown__item ${!selectedRegion ? "fx-dropdown__item--active" : ""}`}
            onClick={() => handleRegionChange("")}
          >
            Toutes les régions
          </button>
          {availableRegions.map((region: string) => (
            <button
              key={region}
              className={`fx-dropdown__item ${selectedRegion === region ? "fx-dropdown__item--active" : ""}`}
              onClick={() => handleRegionChange(region)}
            >
              {region}
            </button>
          ))}
        </Dropdown>
      ),
    },
  ];

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <CustomBreadcrumb config={navigationConfig} />
            </Col>
          </Row>
          <Row className="fr-mb-3w">
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h1 className="fr-h3 fr-mb-0">Vue nationale</h1>
              {hasActiveFilters && (
                <button
                  className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                  onClick={handleResetFilters}
                  type="button"
                >
                  <span
                    className="ri-refresh-line fr-mr-1w"
                    aria-hidden="true"
                  />
                  Réinitialiser les filtres
                </button>
              )}
            </Col>
          </Row>
          <Row gutters>
            {filterCards.map((card) => (
              <Col key={card.title} xs="6" md="3">
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--background-default-grey)",
                    border: "1px solid var(--border-default-grey)",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className={`fr-icon-${card.icon}`}
                        style={{ color: card.iconColor }}
                        aria-hidden="true"
                      />
                    </div>
                    <span
                      className="fr-text--sm fr-text--bold"
                      style={{ color: "var(--text-mention-grey)" }}
                    >
                      {card.title}
                    </span>
                  </div>
                  {card.dropdown}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>
    </main>
  );
}
