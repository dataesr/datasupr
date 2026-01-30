import { useMemo, useState } from "react";
import { Row, Col, Title, Button } from "@dataesr/dsfr-plus";
import Select from "../../../../../components/select";
import Dropdown from "../../../../../components/dropdown";
import { useFilters } from "../../../hooks/useFilters";
import "../../national/styles.scss";

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
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedType,
    selectedTypologie,
    selectedRegion,
    selectedRce,
    selectedDevimmo,
    handleTypeChange,
    handleTypologieChange,
    handleRegionChange,
    handleRceChange,
    handleDevimmoChange,
    handleResetFilters,
    hasActiveFilters,
    labels,
  } = useFilters();
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

  return (
    <Row>
      <Col xs="12" md="8">
        <div className="filter-header fr-mb-2w">
          <Title as="h1" look="h4" className="fr-mb-0">
            Sélectionnez un établissement
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
        </div>

        <div className="filter-bar fr-mb-2w">
          <Dropdown label={labels.type} icon="building-line" size="sm">
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

          <Dropdown label={labels.region} icon="map-pin-2-line" size="sm">
            <Dropdown.Item
              active={!selectedRegion}
              onClick={() => handleRegionChange("")}
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
        </div>

        <div className="filter-bar fr-mb-2w">
          <Dropdown
            label={labels.rce}
            icon="bank-line"
            size="sm"
            className="filter-bar__rce"
          >
            <Dropdown.Item
              active={!selectedRce}
              onClick={() => handleRceChange("")}
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
          <Dropdown
            label={labels.devimmo}
            icon="home-4-line"
            size="sm"
            className="filter-bar__devimmo"
          >
            <Dropdown.Item
              active={!selectedDevimmo}
              onClick={() => handleDevimmoChange("")}
            >
              Avec ou sans dévolution immobilière
            </Dropdown.Item>
            <Dropdown.Item
              active={selectedDevimmo === "devimmo"}
              onClick={() => handleDevimmoChange("devimmo")}
            >
              Avec dévolution immobilière
            </Dropdown.Item>
            <Dropdown.Item
              active={selectedDevimmo === "non-devimmo"}
              onClick={() => handleDevimmoChange("non-devimmo")}
            >
              Sans dévolution immobilière
            </Dropdown.Item>
          </Dropdown>
        </div>

        <div className="filter-bar fr-mb-3w">
          <Dropdown
            label={labels.typologie}
            icon="layout-grid-line"
            size="sm"
            className="filter-bar__typologie"
          >
            <Dropdown.Item
              active={!selectedTypologie}
              onClick={() => handleTypologieChange("")}
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
      <Col xs="12" md="4">
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
