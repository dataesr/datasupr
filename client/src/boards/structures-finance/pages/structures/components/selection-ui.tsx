import { useMemo } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import SearchableSelect from "../../../../../components/searchable-select";

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
}: SelectionUIProps) {
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
      <h1 className="fr-h3 ">Sélectionnez un établissement</h1>

      <div className="fr-mb-2w">
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
                    onClick={() => onTypeChange("tous")}
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
                      onClick={() => onTypeChange(type)}
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
                onChange={(e) => onTypologieChange(e.target.value)}
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
                onChange={(e) => onRegionChange(e.target.value)}
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
          value=""
          onChange={handleEtablissementSelect}
          placeholder="Rechercher un établissement par nom ou ville..."
          label="Établissement"
        />
      </div>
    </>
  );
}
