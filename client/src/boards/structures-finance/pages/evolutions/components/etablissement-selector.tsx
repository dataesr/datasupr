import { useState, useMemo } from "react";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import {
  useFinanceEtablissements,
  useFinanceComparisonFilters,
} from "../../../api";
import { DSFR_COLORS } from "../../../constants/colors";

interface EtablissementSelectorProps {
  selectedYear: string;
  selectedEtablissements: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelection?: number;
}

export default function EtablissementSelector({
  selectedYear,
  selectedEtablissements,
  onSelectionChange,
  maxSelection = 5,
}: EtablissementSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("tous");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("toutes");
  const [selectedRegion, setSelectedRegion] = useState<string>("toutes");

  const { data: etablissements } = useFinanceEtablissements(selectedYear);
  const { data: filtersData } = useFinanceComparisonFilters(selectedYear);

  const types = useMemo(() => filtersData?.types || [], [filtersData]);
  const typologies = useMemo(
    () => filtersData?.typologies || [],
    [filtersData]
  );
  const regions = useMemo(() => filtersData?.regions || [], [filtersData]);

  const filteredEtablissements = useMemo(() => {
    if (!etablissements) return [];
    return etablissements.filter((etab: any) => {
      const matchSearch = etab.nom_actuel
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchType = selectedType === "tous" || etab.type === selectedType;
      const matchTypologie =
        selectedTypologie === "toutes" || etab.typologie === selectedTypologie;
      const matchRegion =
        selectedRegion === "toutes" || etab.region === selectedRegion;

      return matchSearch && matchType && matchTypologie && matchRegion;
    });
  }, [
    etablissements,
    searchTerm,
    selectedType,
    selectedTypologie,
    selectedRegion,
  ]);

  const handleToggle = (id: string) => {
    if (selectedEtablissements.includes(id)) {
      onSelectionChange(selectedEtablissements.filter((eid) => eid !== id));
    } else {
      if (selectedEtablissements.length >= maxSelection) {
        alert(
          `Vous pouvez sélectionner au maximum ${maxSelection} établissements`
        );
        return;
      }
      onSelectionChange([...selectedEtablissements, id]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div
      className="fr-p-3w fr-mb-3w"
      style={{
        backgroundColor: DSFR_COLORS.backgroundAlt,
        borderRadius: "8px",
        border: `1px solid ${DSFR_COLORS.borderDefault}`,
      }}
    >
      <Row gutters>
        <Col md="12">
          <div className="fr-search-bar" role="search">
            <label className="fr-label" htmlFor="search-etablissement">
              Rechercher un établissement
            </label>
            <input
              className="fr-input"
              placeholder="Nom de l'établissement..."
              type="search"
              id="search-etablissement"
              name="search-etablissement"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
      </Row>

      <Row gutters className="fr-mt-2w">
        <Col md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="filter-type">
              Type d'établissement
            </label>
            <select
              className="fr-select"
              id="filter-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="tous">Tous les types</option>
              {types.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="filter-typologie">
              Typologie
            </label>
            <select
              className="fr-select"
              id="filter-typologie"
              value={selectedTypologie}
              onChange={(e) => setSelectedTypologie(e.target.value)}
            >
              <option value="toutes">Toutes les typologies</option>
              {typologies.map((typo: string) => (
                <option key={typo} value={typo}>
                  {typo}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col md="3">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="filter-region">
              Région
            </label>
            <select
              className="fr-select"
              id="filter-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="toutes">Toutes les régions</option>
              {regions.map((region: string) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col md="3" style={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleClearAll}
            disabled={selectedEtablissements.length === 0}
          >
            Tout désélectionner
          </Button>
        </Col>
      </Row>

      <div className="fr-mt-3w">
        <p
          className="fr-text--sm fr-mb-2v"
          style={{ color: DSFR_COLORS.textDefault }}
        >
          Sélectionnés : {selectedEtablissements.length} / {maxSelection}
        </p>

        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            border: `1px solid ${DSFR_COLORS.borderDefault}`,
            borderRadius: "4px",
            backgroundColor: "var(--background-default-grey)",
          }}
        >
          {filteredEtablissements.length === 0 && (
            <div className="fr-p-3w" style={{ textAlign: "center" }}>
              <p style={{ color: DSFR_COLORS.textDefault }}>
                Aucun établissement trouvé
              </p>
            </div>
          )}

          {filteredEtablissements.map((etab: any, index: number) => {
            const etablissementId = etab.id_actuel || etab.id;
            const uniqueKey = `${etablissementId}-${index}`;
            const isSelected = selectedEtablissements.includes(etablissementId);
            return (
              <div
                key={uniqueKey}
                className="fr-p-2w"
                style={{
                  borderBottom: `1px solid ${DSFR_COLORS.borderDefault}`,
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "var(--background-contrast-info)"
                    : "transparent",
                  transition: "background-color 0.2s",
                }}
                onClick={() => handleToggle(etablissementId)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor =
                      DSFR_COLORS.backgroundDefaultHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="fr-checkbox__input"
                    style={{ marginRight: "1rem" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      className="fr-text--sm fr-text--bold"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      {etab.nom_actuel}
                    </div>
                    <div
                      className="fr-text--xs"
                      style={{ color: DSFR_COLORS.textDefault }}
                    >
                      {etab.type} • {etab.region}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
