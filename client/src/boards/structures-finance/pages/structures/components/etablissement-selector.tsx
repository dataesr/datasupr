import { Row, Col } from "@dataesr/dsfr-plus";
import SearchableSelect from "../../../components/searchable-select";
import { CHART_COLORS, DSFR_COLORS } from "../../../constants/colors";

interface EtablissementSelectorProps {
  availableTypes: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;

  availableRegions: string[];
  selectedRegion: string;
  onRegionChange: (region: string) => void;

  availableTypologies: string[];
  selectedTypologie: string;
  onTypologieChange: (typologie: string) => void;

  etablissementOptions: Array<{
    id: string;
    label: string;
    searchableText: string;
    subtitle?: string;
  }>;
  selectedEtablissement: string;
  onEtablissementChange: (id: string) => void;
}

export default function EtablissementSelector({
  availableTypes,
  selectedType,
  onTypeChange,
  availableRegions,
  selectedRegion,
  onRegionChange,
  availableTypologies,
  selectedTypologie,
  onTypologieChange,
  etablissementOptions,
  selectedEtablissement,
  onEtablissementChange,
}: EtablissementSelectorProps) {
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
                onChange={(e) => onTypeChange(e.target.value)}
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
                onChange={(e) => onTypologieChange(e.target.value)}
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
                onChange={(e) => onRegionChange(e.target.value)}
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
              onChange={onEtablissementChange}
              placeholder="Rechercher un établissement..."
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
