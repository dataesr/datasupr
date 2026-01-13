import { Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import SearchableSelect from "../../../components/searchable-select";
import { CHART_COLORS, DSFR_COLORS } from "../../../constants/colors";
import { useStructuresFilters } from "../hooks/useStructuresFilters";
import { useFinanceYears } from "../../../api";

export default function EtablissementSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const defaultYear = useMemo(() => {
    if (!years.length) return "";
    return years.includes(2024) ? "2024" : String(years[0]);
  }, [years]);

  const selectedYear = searchParams.get("year") || defaultYear;
  const selectedType = searchParams.get("type") || "tous";
  // ATTENTION REMETTRE QUAND ON AURA LES DONNEES 2025
  // const selectedYear = yearFromUrl || years[0] || "";
  const selectedRegion = searchParams.get("region") || "toutes";
  const selectedTypologie = searchParams.get("typologie") || "toutes";
  const selectedEtablissement = searchParams.get("structureId") || "";

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

  const handleTypeChange = (type: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("type", type);
    next.delete("typologie");
    next.delete("region");
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("region", region);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleTypologieChange = (typologie: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("typologie", typologie);
    next.delete("structureId");
    setSearchParams(next);
  };

  const handleEtablissementChange = (structureId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("structureId", structureId);
    if (!searchParams.has("year") && defaultYear) {
      next.set("year", defaultYear);
    }
    setSearchParams(next);
  };

  return (
    <>
      <div
        className="fr-p-3w fr-mb-3w"
        style={{
          backgroundColor: DSFR_COLORS.backgroundDefaultHover,
          borderRadius: "8px",
          border: `2px solid ${CHART_COLORS.primary}`,
        }}
      >
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
            color: CHART_COLORS.primary,
          }}
        >
          Sélectionner un établissement
        </h3>

        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Type</strong>
              </label>
              <select
                className="fr-select"
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="tous">Tous les types</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs="12" sm="6" md="4">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Typologie</strong>
              </label>
              <select
                className="fr-select"
                value={selectedTypologie}
                onChange={(e) => handleTypologieChange(e.target.value)}
              >
                <option value="toutes">Toutes les typologies</option>
                {availableTypologies.map((typologie) => (
                  <option key={typologie} value={typologie}>
                    {typologie}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs="12" sm="6" md="4">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Région</strong>
              </label>
              <select
                className="fr-select"
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                <option value="toutes">Toutes les régions</option>
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>

        <Row gutters className="fr-mt-2w">
          <Col xs="12">
            <SearchableSelect
              label="Établissement"
              options={etablissementOptions}
              value={selectedEtablissement}
              onChange={handleEtablissementChange}
              placeholder="Rechercher un établissement..."
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
