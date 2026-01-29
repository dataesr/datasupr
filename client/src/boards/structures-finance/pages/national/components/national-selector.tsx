import { Row, Col, Container, Title, Text, Button } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { useFinanceYears } from "../../../api/common";
import { useFinanceAdvancedComparison } from "../../../api/api";
import { useNationalFilters } from "../hooks/useNationalFilters";
import Breadcrumb from "../../../../financements-par-aap/components/breadcrumb";
import Dropdown from "../../../../../components/dropdown";
import "../styles.scss";

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

  useEffect(() => {
    let hasChanges = false;

    if (searchParams.has("structureId")) {
      searchParams.delete("structureId");
      hasChanges = true;
    }
    if (searchParams.has("section")) {
      searchParams.delete("section");
      hasChanges = true;
    }
    if (searchParams.get("type") === "tous") {
      searchParams.delete("type");
      hasChanges = true;
    }
    if (searchParams.get("region") === "toutes") {
      searchParams.delete("region");
      hasChanges = true;
    }
    if (searchParams.get("typologie") === "toutes") {
      searchParams.delete("typologie");
      hasChanges = true;
    }

    if (hasChanges) {
      setSearchParams(searchParams, { replace: true });
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

    searchParams.set("year", defaultYear);
    setSearchParams(searchParams);
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
      searchParams.set("type", typeToSet);
      setSearchParams(searchParams);
    }
  }, [availableTypes, selectedType, setSearchParams]);

  const handleYearChange = (year: string) => {
    searchParams.set("year", year);
    setSearchParams(searchParams);
  };

  const handleTypeChange = (type: string) => {
    if (type) {
      searchParams.set("type", type);
    } else {
      searchParams.delete("type");
    }
    searchParams.delete("typologie");
    searchParams.delete("region");
    setSearchParams(searchParams);
  };

  const handleTypologieChange = (typologie: string) => {
    if (typologie) {
      searchParams.set("typologie", typologie);
    } else {
      searchParams.delete("typologie");
    }
    setSearchParams(searchParams);
  };

  const handleRegionChange = (region: string) => {
    if (region) {
      searchParams.set("region", region);
    } else {
      searchParams.delete("region");
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    searchParams.delete("type");
    searchParams.delete("typologie");
    searchParams.delete("region");
    hasInitializedType.current = false;
    setSearchParams(searchParams);
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
      dropdown: (
        <Dropdown label={selectedYear} size="sm" fullWidth>
          {years.map((year) => (
            <Dropdown.Item
              key={year}
              active={selectedYear === String(year)}
              onClick={() => handleYearChange(String(year))}
            >
              {year}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "building-line",
      title: "Type",
      value: typeLabel,
      dropdown: (
        <Dropdown label={typeLabel} size="sm" fullWidth>
          <Dropdown.Item
            active={!selectedType}
            onClick={() => handleTypeChange("")}
          >
            Tous les types
          </Dropdown.Item>
          {availableTypes.map((type: string) => (
            <Dropdown.Item
              key={type}
              active={selectedType === type}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "layout-grid-line",
      title: "Typologie",
      value: typologieLabel,
      dropdown: (
        <Dropdown label={typologieLabel} size="sm" fullWidth>
          <Dropdown.Item
            active={!selectedTypologie}
            onClick={() => handleTypologieChange("")}
          >
            Toutes les typologies
          </Dropdown.Item>
          {availableTypologies.map((typo: string) => (
            <Dropdown.Item
              key={typo}
              active={selectedTypologie === typo}
              onClick={() => handleTypologieChange(typo)}
            >
              {typo}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ),
    },
    {
      icon: "map-pin-2-line",
      title: "Région",
      value: regionLabel,
      dropdown: (
        <Dropdown label={regionLabel} size="sm" fullWidth>
          <Dropdown.Item
            active={!selectedRegion}
            onClick={() => handleRegionChange("")}
          >
            Toutes les régions
          </Dropdown.Item>
          {availableRegions.map((region: string) => (
            <Dropdown.Item
              key={region}
              active={selectedRegion === region}
              onClick={() => handleRegionChange(region)}
            >
              {region}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ),
    },
  ];

  return (
    <Container fluid className="etablissement-selector__wrapper">
      <Container as="section">
        <Row>
          <Col xs="12" md="12">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/structures-finance/accueil" },
                { label: "Vue nationale" },
              ]}
            />
          </Col>
        </Row>
        <Row className="fr-mb-3w">
          <Col className="national-selector__header">
            <Title as="h1" look="h3" className="fr-mb-0">
              Vue nationale
            </Title>
            {hasActiveFilters && (
              <Button
                variant="tertiary"
                size="sm"
                icon="refresh-line"
                iconPosition="left"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </Col>
        </Row>
        <Row gutters>
          {filterCards.map((card) => (
            <Col key={card.title} xs="6" md="3">
              <div className="national-selector__filter-card">
                <div className="national-selector__filter-header">
                  <div
                    className={`national-selector__filter-icon national-selector__filter-icon--${card.icon}`}
                    aria-hidden="true"
                  >
                    <span
                      className={`fr-icon-${card.icon}`}
                      aria-hidden="true"
                    />
                  </div>
                  <Text
                    size="sm"
                    bold
                    className="fr-mb-0 fr-text-mention--grey"
                  >
                    {card.title}
                  </Text>
                </div>
                {card.dropdown}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}
