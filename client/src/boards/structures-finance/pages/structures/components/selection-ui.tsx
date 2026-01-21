import { useMemo } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import SearchableSelect from "../../../../../components/searchable-select";
import Dropdown from "../../../../../components/dropdown";

interface SelectionUIProps {
  selectedType: string;
  selectedTypologie: string;
  selectedRegion: string;
  availableTypes: string[];
  availableTypologies: string[];
  availableRegions: string[];
  filteredEtablissements: any[];
  onTypeChange: (type: string) => void;
  onTypologieChange: (typologie: string) => void;
  onRegionChange: (region: string) => void;
  onEtablissementSelect: (id: string) => void;
  onResetFilters?: () => void;
}

export default function SelectionUI({
  selectedType,
  selectedTypologie,
  selectedRegion,
  availableTypes,
  availableTypologies,
  availableRegions,
  filteredEtablissements,
  onTypeChange,
  onTypologieChange,
  onRegionChange,
  onEtablissementSelect,
  onResetFilters,
}: SelectionUIProps) {
  const hasActiveFilters =
    (selectedType && selectedType !== "tous") ||
    (selectedTypologie && selectedTypologie !== "toutes") ||
    (selectedRegion && selectedRegion !== "toutes");
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

    onEtablissementSelect(finalId);
  };

  const typeLabel = selectedType === "tous" ? "Tous les types" : selectedType;
  const typologieLabel =
    selectedTypologie === "toutes" ? "Toutes" : selectedTypologie;
  const regionLabel = selectedRegion === "toutes" ? "Toutes" : selectedRegion;

  return (
    <Row>
      <Col xs="12" md="8">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <h1 className="fr-h4 fr-mb-0">Sélectionnez un établissement</h1>
          {hasActiveFilters && onResetFilters && (
            <button
              className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
              onClick={onResetFilters}
              type="button"
            >
              <span className="ri-refresh-line fr-mr-1w" aria-hidden="true" />
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div
          className="fr-mb-3w"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Dropdown label={typeLabel} icon="building-line" size="sm">
            <button
              className={`fx-dropdown__item ${selectedType === "tous" ? "fx-dropdown__item--active" : ""}`}
              onClick={() => onTypeChange("tous")}
            >
              Tous les types
            </button>
            {availableTypes.map((type: string) => (
              <button
                key={type}
                className={`fx-dropdown__item ${selectedType === type ? "fx-dropdown__item--active" : ""}`}
                onClick={() => onTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </Dropdown>

          <Dropdown label={typologieLabel} icon="layout-grid-line" size="sm">
            <button
              className={`fx-dropdown__item ${selectedTypologie === "toutes" ? "fx-dropdown__item--active" : ""}`}
              onClick={() => onTypologieChange("toutes")}
            >
              Toutes les typologies
            </button>
            {availableTypologies.map((typo) => (
              <button
                key={typo}
                className={`fx-dropdown__item ${selectedTypologie === typo ? "fx-dropdown__item--active" : ""}`}
                onClick={() => onTypologieChange(typo)}
              >
                {typo}
              </button>
            ))}
          </Dropdown>

          <Dropdown label={regionLabel} icon="map-pin-2-line" size="sm">
            <button
              className={`fx-dropdown__item ${selectedRegion === "toutes" ? "fx-dropdown__item--active" : ""}`}
              onClick={() => onRegionChange("toutes")}
            >
              Toutes les régions
            </button>
            {availableRegions.map((region) => (
              <button
                key={region}
                className={`fx-dropdown__item ${selectedRegion === region ? "fx-dropdown__item--active" : ""}`}
                onClick={() => onRegionChange(region)}
              >
                {region}
              </button>
            ))}
          </Dropdown>
        </div>

        <div className="fr-mb-3w">
          <p className="fr-text--xs fr-mb-1w fr-text-mention--grey">
            {filteredEtablissements.length} établissement
            {filteredEtablissements.length > 1 ? "s" : ""} disponible
            {filteredEtablissements.length > 1 ? "s" : ""}
          </p>
          <SearchableSelect
            options={etablissementOptions}
            value=""
            onChange={handleEtablissementSelect}
            placeholder="Rechercher un établissement par nom ou ville..."
            label=""
          />
        </div>
      </Col>
      <Col
        xs="12"
        md="4"
        className="fr-hidden fr-unhidden-md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          className="fr-artwork"
          aria-hidden="true"
          viewBox="0 0 80 80"
          width="180px"
          height="180px"
        >
          <use
            className="fr-artwork-decorative"
            href="/artwork/pictograms/buildings/school.svg#artwork-decorative"
          />
          <use
            className="fr-artwork-minor"
            href="/artwork/pictograms/buildings/school.svg#artwork-minor"
          />
          <use
            className="fr-artwork-major"
            href="/artwork/pictograms/buildings/school.svg#artwork-major"
          />
        </svg>
      </Col>
    </Row>
  );
}
