import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col } from "@dataesr/dsfr-plus";
import Select from "../../../../../components/select";
import Dropdown from "../../../../../components/dropdown";

interface SelectionUIProps {
  availableTypes: string[];
  availableTypologies: string[];
  availableRegions: string[];
  filteredEtablissements: any[];
  onEtablissementSelect: (id: string) => void;
}

export default function SelectionUI({
  availableTypes,
  availableTypologies,
  availableRegions,
  filteredEtablissements,
  onEtablissementSelect,
}: SelectionUIProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRegion = searchParams.get("region") || "toutes";
  const selectedType = searchParams.get("type") || "tous";
  const selectedTypologie = searchParams.get("typologie") || "toutes";
  const selectedRce = searchParams.get("rce") || "tous";
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegionChange = (region: string) => {
    setSearchParams({
      region,
      type: selectedType,
      typologie: selectedTypologie,
      rce: selectedRce,
    });
  };

  const handleTypeChange = (type: string) => {
    setSearchParams({
      region: selectedRegion,
      type,
      typologie: "toutes",
      rce: selectedRce,
    });
  };

  const handleTypologieChange = (typologie: string) => {
    setSearchParams({
      region: selectedRegion,
      type: selectedType,
      typologie,
      rce: selectedRce,
    });
  };

  const handleRceChange = (rce: string) => {
    setSearchParams({
      region: selectedRegion,
      type: selectedType,
      typologie: selectedTypologie,
      rce,
    });
  };

  const handleResetFilters = () => {
    setSearchParams({ region: "toutes" });
  };

  const hasActiveFilters =
    (selectedType && selectedType !== "tous") ||
    (selectedTypologie && selectedTypologie !== "toutes") ||
    (selectedRegion && selectedRegion !== "toutes") ||
    (selectedRce && selectedRce !== "tous");
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

  const handleEtablissementSelect = (id?: string) => {
    if (id) {
      const selected = etablissementOptions.find((opt) => opt.id === id);
      const finalId = selected?.data?.etablissement_id_paysage || id;

      if (!finalId || finalId === "undefined") {
        console.error("Invalid establishment ID:", finalId);
        return;
      }

      onEtablissementSelect(finalId);
    }
  };

  const typeLabel = selectedType === "tous" ? "Tous les types" : selectedType;
  const typologieLabel =
    selectedTypologie === "toutes"
      ? "Toutes les typologies"
      : selectedTypologie;
  const regionLabel =
    selectedRegion === "toutes" ? "Toutes les régions" : selectedRegion;
  const rceLabel =
    selectedRce === "tous"
      ? "RCE et non RCE"
      : selectedRce === "rce"
        ? "RCE uniquement"
        : "Non RCE uniquement";

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
          {hasActiveFilters && (
            <button
              className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
              onClick={handleResetFilters}
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
            <Dropdown.Item
              active={selectedType === "tous"}
              onClick={() => handleTypeChange("tous")}
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

          <Dropdown label={typologieLabel} icon="layout-grid-line" size="sm">
            <Dropdown.Item
              active={selectedTypologie === "toutes"}
              onClick={() => handleTypologieChange("toutes")}
            >
              Toutes les typologies
            </Dropdown.Item>
            {availableTypologies.map((typo) => (
              <Dropdown.Item
                key={typo}
                active={selectedTypologie === typo}
                onClick={() => handleTypologieChange(typo)}
              >
                {typo}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <Dropdown label={regionLabel} icon="map-pin-2-line" size="sm">
            <Dropdown.Item
              active={selectedRegion === "toutes"}
              onClick={() => handleRegionChange("toutes")}
            >
              Toutes les régions
            </Dropdown.Item>
            {availableRegions.map((region) => (
              <Dropdown.Item
                key={region}
                active={selectedRegion === region}
                onClick={() => handleRegionChange(region)}
              >
                {region}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <Dropdown label={rceLabel} icon="bank-line" size="sm">
            <Dropdown.Item
              active={selectedRce === "tous"}
              onClick={() => handleRceChange("tous")}
            >
              RCE et non RCE
            </Dropdown.Item>
            <Dropdown.Item
              active={selectedRce === "rce"}
              onClick={() => handleRceChange("rce")}
            >
              RCE uniquement
            </Dropdown.Item>
            <Dropdown.Item
              active={selectedRce === "non-rce"}
              onClick={() => handleRceChange("non-rce")}
            >
              Non RCE uniquement
            </Dropdown.Item>
          </Dropdown>
        </div>

        <div className="fr-mb-3w">
          <Select
            label="Rechercher un établissement..."
            icon="search-line"
            size="md"
            fullWidth
          >
            <Select.Search
              placeholder="Rechercher par nom ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select.Content maxHeight="300px">
              {etablissementOptions
                .filter((opt) =>
                  searchQuery
                    ? opt.searchableText
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    : true
                )
                .slice(0, 50)
                .map((opt) => (
                  <Select.Option
                    key={opt.id}
                    value={opt.id}
                    onClick={() => handleEtablissementSelect(opt.id)}
                  >
                    {opt.label}
                  </Select.Option>
                ))}
              {etablissementOptions.filter((opt) =>
                searchQuery
                  ? opt.searchableText
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  : true
              ).length === 0 && (
                <Select.Empty>Aucun établissement trouvé</Select.Empty>
              )}
            </Select.Content>
          </Select>
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
