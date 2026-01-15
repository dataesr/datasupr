import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col } from "@dataesr/dsfr-plus";
import { useStructuresFilters } from "../../hooks/useStructuresFilters";
import { useFinanceYears } from "../../../../api";
import SearchableSelect from "../../../../../../components/searchable-select";

interface FiltersProps {
  selectedEtablissement: string;
}

export default function Filters({ selectedEtablissement }: FiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const defaultYear = useMemo(() => {
    if (!years.length) return "";
    return "2024";
  }, [years]);

  const selectedYear = searchParams.get("year") || defaultYear;
  const selectedRegion = searchParams.get("region") || "toutes";

  useEffect(() => {
    if (!searchParams.get("year") && defaultYear && years.length > 0) {
      const next = new URLSearchParams(searchParams);
      next.set("year", defaultYear);
      setSearchParams(next, { replace: true });
    }
  }, [years, defaultYear, searchParams, setSearchParams]);

  const [selectedType, setSelectedType] = useState("Universités et assimilés");
  const [selectedTypologie, setSelectedTypologie] = useState("toutes");

  const {
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
  } = useStructuresFilters({
    selectedYear,
    selectedType,
    selectedRegion,
    selectedTypologie,
  });

  const etablissementOptions = useMemo(
    () =>
      filteredEtablissements
        .map((etab: any) => {
          const displayName =
            etab.etablissement_actuel_lib || etab.etablissement_lib || etab.nom;
          const searchText = [
            displayName,
            etab.etablissement_lib,
            etab.etablissement_actuel_lib,
            etab.nom,
            etab.champ_recherche,
            etab.etablissement_actuel_region || etab.region,
          ]
            .filter(Boolean)
            .join(" ");

          return {
            id:
              etab.etablissement_id_paysage ||
              etab.etablissement_id_paysage_actuel ||
              etab.id,
            label: `${displayName}${
              etab.etablissement_actuel_region || etab.region
                ? ` — ${etab.etablissement_actuel_region || etab.region}`
                : ""
            }`,
            searchableText: searchText,
            subtitle: etab.champ_recherche,
          };
        })
        .sort((a, b) => {
          return a.label.localeCompare(b.label, "fr", { sensitivity: "base" });
        }),
    [filteredEtablissements]
  );

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("region", region);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleEtablissementChange = (structureId: string) => {
    const next = new URLSearchParams(searchParams);
    if (structureId) {
      next.set("structureId", structureId);
    } else {
      next.delete("structureId");
    }
    setSearchParams(next);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedTypologie("toutes");
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleTypologieChange = (typologie: string) => {
    setSelectedTypologie(typologie);
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", year);
    setSearchParams(next);
  };

  const typologieOptions = [
    { value: "toutes", label: "Toutes les typologies" },
    ...availableTypologies.map((typo: string) => ({
      value: typo,
      label: typo,
    })),
  ];

  const regionOptions = [
    { value: "toutes", label: "Toutes les régions" },
    ...availableRegions.map((region: string) => ({
      value: region,
      label: region,
    })),
  ];

  return (
    <>
      {!selectedEtablissement ? (
        <>
          <SearchableSelect
            options={etablissementOptions}
            value={selectedEtablissement}
            onChange={handleEtablissementChange}
            placeholder="Rechercher un établissement par nom ou ville..."
            label="Établissement"
          />

          <div className="fr-mt-2w">
            <Row gutters>
              <Col xs="12" md="7">
                <fieldset className="fr-fieldset">
                  <legend className="fr-fieldset__legend fr-text--regular">
                    <span className="fr-label">Type</span>
                  </legend>
                  <div className="fr-fieldset__content">
                    <div className="fr-tags-group">
                      <button
                        type="button"
                        className={`fr-tag ${
                          selectedType === "tous" ? "fr-tag--dismiss" : ""
                        }`}
                        aria-pressed={selectedType === "tous"}
                        onClick={() => handleTypeChange("tous")}
                      >
                        Tous
                      </button>
                      {availableTypes.map((type: string) => (
                        <button
                          key={type}
                          type="button"
                          className={`fr-tag ${
                            selectedType === type ? "fr-tag--dismiss" : ""
                          }`}
                          aria-pressed={selectedType === type}
                          onClick={() => handleTypeChange(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </fieldset>
              </Col>

              <Col xs="6" md="2">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="select-typologie">
                    Typologie
                  </label>
                  <select
                    className="fr-select"
                    id="select-typologie"
                    name="typologie"
                    value={selectedTypologie}
                    onChange={(e) => handleTypologieChange(e.target.value)}
                  >
                    {typologieOptions.map((typologie) => (
                      <option key={typologie.value} value={typologie.value}>
                        {typologie.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col xs="6" md="3">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="select-region">
                    Région
                  </label>
                  <select
                    className="fr-select"
                    id="select-region"
                    name="region"
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                  >
                    {regionOptions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
          <Row gutters className="fr-mb-2w">
            <Col xs="12">
              <SearchableSelect
                options={etablissementOptions}
                value={selectedEtablissement}
                onChange={handleEtablissementChange}
                placeholder="Rechercher un établissement..."
                label="Établissement"
              />
            </Col>
          </Row>

          <Row gutters className="fr-mb-2w" style={{ fontSize: "0.875rem" }}>
            <Col xs="6" md="3">
              <div className="fr-select-group">
                <label
                  className="fr-label"
                  htmlFor="select-year-selected"
                  style={{ fontSize: "0.875rem" }}
                >
                  Année
                </label>
                <select
                  className="fr-select"
                  id="select-year-selected"
                  name="year"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col xs="12" md="9">
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend fr-text--regular">
                  <span className="fr-label" style={{ fontSize: "0.875rem" }}>
                    Type
                  </span>
                </legend>
                <div className="fr-fieldset__content">
                  <div className="fr-tags-group">
                    <button
                      type="button"
                      className={`fr-tag fr-tag--sm ${
                        selectedType === "tous" ? "fr-tag--dismiss" : ""
                      }`}
                      aria-pressed={selectedType === "tous"}
                      onClick={() => handleTypeChange("tous")}
                    >
                      Tous
                    </button>
                    {availableTypes.map((type: string) => (
                      <button
                        key={type}
                        type="button"
                        className={`fr-tag fr-tag--sm ${
                          selectedType === type ? "fr-tag--dismiss" : ""
                        }`}
                        aria-pressed={selectedType === type}
                        onClick={() => handleTypeChange(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>
            </Col>
          </Row>

          <Row gutters className="fr-mb-2w" style={{ fontSize: "0.875rem" }}>
            <Col xs="6" md="4">
              <div className="fr-select-group">
                <label
                  className="fr-label"
                  htmlFor="select-typologie-compact"
                  style={{ fontSize: "0.875rem" }}
                >
                  Typologie
                </label>
                <select
                  className="fr-select"
                  id="select-typologie-compact"
                  name="typologie"
                  value={selectedTypologie}
                  onChange={(e) => handleTypologieChange(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  {typologieOptions.map((typologie) => (
                    <option key={typologie.value} value={typologie.value}>
                      {typologie.label}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col xs="6" md="4">
              <div className="fr-select-group">
                <label
                  className="fr-label"
                  htmlFor="select-region-compact"
                  style={{ fontSize: "0.875rem" }}
                >
                  Région
                </label>
                <select
                  className="fr-select"
                  id="select-region-compact"
                  name="region"
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  {regionOptions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
