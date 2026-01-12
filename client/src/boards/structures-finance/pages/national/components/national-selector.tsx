import { Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { DSFR_COLORS } from "../../../constants/colors";
import { useFinanceYears, useFinanceAdvancedComparison } from "../../../api";
import { useNationalFilters } from "../hooks/useNationalFilters";

export default function NationalSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const hasInitializedType = useRef(false);

  const yearFromUrl = searchParams.get("year") || "";
  const selectedYear = yearFromUrl || years[0] || "";
  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";

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

    const fallback = yearsStr[0];
    const next = new URLSearchParams(searchParams);
    next.set("year", fallback);
    setSearchParams(next);
  }, [years, yearFromUrl, searchParams, setSearchParams]);

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
  return (
    <section
      className="fr-p-3w fr-mb-3w"
      style={{
        backgroundColor: DSFR_COLORS.backgroundDefaultHover,
        borderRadius: "8px",
        border: `1px solid ${DSFR_COLORS.borderDefault}`,
      }}
      aria-labelledby="filters-title"
    >
      <h2 id="filters-title" className="fr-h6 fr-mb-3w">
        Filtres de sélection
      </h2>
      <Row gutters>
        <Col xs="12" sm="6" md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-year">
              <strong>Année</strong>
              <span className="fr-hint-text">Année de référence</span>
            </label>
            <select
              id="select-year"
              className="fr-select"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              aria-required="true"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Exercice {year}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col xs="12" sm="6" md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-type">
              <strong>Type d'établissement</strong>
              <span className="fr-hint-text">Filtrer par type (optionnel)</span>
            </label>
            <select
              id="select-type"
              className="fr-select"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="">Tous les types</option>
              {availableTypes.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col xs="12" sm="6" md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-typologie">
              <strong>Typologie</strong>
              <span className="fr-hint-text">
                Filtrer par typologie (optionnel)
              </span>
            </label>
            <select
              id="select-typologie"
              className="fr-select"
              value={selectedTypologie}
              onChange={(e) => handleTypologieChange(e.target.value)}
            >
              <option value="">Toutes les typologies</option>
              {availableTypologies.map((typo: string) => (
                <option key={typo} value={typo}>
                  {typo}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col xs="12" sm="6" md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-region">
              <strong>Région</strong>
              <span className="fr-hint-text">
                Filtrer par région (optionnel)
              </span>
            </label>
            <select
              id="select-region"
              className="fr-select"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {availableRegions.map((region: string) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
    </section>
  );
}
