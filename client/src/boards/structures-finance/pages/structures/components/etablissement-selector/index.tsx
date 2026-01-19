import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import {
  useFinanceYears,
  useFinanceEtablissementDetail,
} from "../../../../api";
import { useStructuresFilters } from "../../hooks/useStructuresFilters";
import SearchableSelect from "../../../../../../components/searchable-select";
import PageHeader from "./InfoCard";
import EtablissementCards from "./EtablissementCards";
import "./styles.scss";

export default function EtablissementSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const defaultYear = "2024";

  const selectedYear = searchParams.get("year") || defaultYear;
  const selectedEtablissement = searchParams.get("structureId") || "";
  const selectedRegion = searchParams.get("region") || "toutes";

  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTypologie, setSelectedTypologie] = useState("toutes");

  const { data: detailData } = useFinanceEtablissementDetail(
    selectedEtablissement,
    String(selectedYear || years[0] || ""),
    !!selectedEtablissement && !!(selectedYear || years[0])
  );

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

          const id =
            etab.etablissement_id_paysage ||
            etab.etablissement_id_paysage_actuel ||
            etab.id;

          return {
            id,
            hasValidPaysageId: !!etab.etablissement_id_paysage,
            label: `${displayName}${
              etab.etablissement_actuel_region || etab.region
                ? ` — ${etab.etablissement_actuel_region || etab.region}`
                : ""
            }`,
            searchableText: searchText,
            subtitle: etab.champ_recherche,
            data: etab,
          };
        })
        .sort((a, b) => {
          return a.label.localeCompare(b.label, "fr", { sensitivity: "base" });
        }),
    [filteredEtablissements]
  );

  const handleEtablissementSelect = (id: string) => {
    const selected = etablissementOptions.find((opt) => opt.id === id);

    const finalId = selected?.data?.etablissement_id_paysage || id;

    if (!finalId || finalId === "undefined") {
      console.error("Invalid establishment ID:", finalId);
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set("structureId", finalId);
    next.set("section", "ressources");
    next.set("year", selectedYear || "2024");
    next.delete("type");
    next.delete("region");
    next.delete("typologie");
    setSearchParams(next);
  };

  const handleClearSelection = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("region", region);
    next.delete("structureId");
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

  if (!selectedEtablissement) {
    return (
      <section
        className="etablissement-selector"
        aria-labelledby="selector-heading"
      >
        <Container fluid className="etablissement-selector__wrapper">
          <Container className="fr-py-4w">
            <h1 className="fr-h3 fr-mb-3w">Sélectionnez un établissement</h1>

            <div className="fr-mb-3w">
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

            <div className="fr-mb-3w">
              <SearchableSelect
                options={etablissementOptions}
                value={selectedEtablissement}
                onChange={handleEtablissementSelect}
                placeholder="Rechercher un établissement par nom ou ville..."
                label="Établissement"
              />
            </div>
          </Container>
        </Container>

        <Container className="fr-mt-4w">
          <EtablissementCards
            options={etablissementOptions}
            onSelect={handleEtablissementSelect}
          />
        </Container>
      </section>
    );
  }

  return (
    <section
      className="etablissement-selector"
      aria-labelledby="selector-heading"
    >
      <PageHeader
        data={detailData}
        onClose={handleClearSelection}
        years={years}
        selectedYear={selectedYear}
      />
    </section>
  );
}
