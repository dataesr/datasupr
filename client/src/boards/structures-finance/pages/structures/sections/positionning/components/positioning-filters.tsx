import { Row, Col } from "@dataesr/dsfr-plus";
import Dropdown from "../../../../../../../components/dropdown";
import type { PositioningFilters } from "../hooks/usePositioningFilteredData";
import "./positioning-filters.scss";

interface PositioningFiltersProps {
  data: any[];
  currentStructure: any;
  filters: PositioningFilters;
  onFiltersChange: (filters: PositioningFilters) => void;
}

export default function PositioningFilters({
  currentStructure,
  filters,
  onFiltersChange,
}: PositioningFiltersProps) {
  const structureType =
    currentStructure?.etablissement_actuel_type || currentStructure?.type || "";
  const structureTypologie =
    currentStructure?.etablissement_actuel_typologie ||
    currentStructure?.typologie ||
    "";
  const structureRegion =
    currentStructure?.etablissement_actuel_region ||
    currentStructure?.region ||
    "";

  const handleFilterChange = (key: keyof PositioningFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getTypeLabel = () => {
    if (!filters.type) return "Tous les types";
    return `Même type (${structureType})`;
  };

  const getTypologieLabel = () => {
    if (!filters.typologie) return "Toutes les typologies";
    return `Même typologie (${structureTypologie})`;
  };

  const getRegionLabel = () => {
    if (!filters.region) return "Toutes les régions";
    return `Même région (${structureRegion})`;
  };

  const getRceLabel = () => {
    if (!filters.rce) return "RCE et non RCE";
    if (filters.rce === "rce") return "RCE uniquement";
    return "Non RCE uniquement";
  };

  const getDevimmoLabel = () => {
    if (!filters.devimmo) return "Avec ou sans dévolution immobilière";
    if (filters.devimmo === "devimmo") return "Avec dévolution immobilière";
    return "Sans dévolution immobilière";
  };

  return (
    <div className="positioning-filters fr-mb-3w">
      <Row gutters>
        <Col xs="12" md="12">
          <div className="positioning-filters__card">
            <div className="positioning-filters__card-header">
              <div className="positioning-filters__icon-wrapper positioning-filters__icon-wrapper--blue">
                <span className="fr-icon-filter-line" aria-hidden="true" />
              </div>
              <span className="fr-text--sm fr-text--bold text-mention-grey">
                Filtrer la comparaison
              </span>
            </div>

            <div className="fr-mb-2w">
              <Row gutters>
                <Col xs="12" md="6">
                  <Dropdown
                    label={getTypeLabel()}
                    icon="building-line"
                    size="sm"
                    fullWidth
                  >
                    <Dropdown.Item
                      active={!filters.type}
                      onClick={() => handleFilterChange("type", "")}
                    >
                      Tous les types
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.type === "same-type"}
                      onClick={() => handleFilterChange("type", "same-type")}
                    >
                      Même type ({structureType})
                    </Dropdown.Item>
                  </Dropdown>
                </Col>
                <Col xs="12" md="6">
                  <Dropdown
                    label={getRegionLabel()}
                    icon="map-pin-2-line"
                    size="sm"
                    fullWidth
                  >
                    <Dropdown.Item
                      active={!filters.region}
                      onClick={() => handleFilterChange("region", "")}
                    >
                      Toutes les régions
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.region === "same-region"}
                      onClick={() =>
                        handleFilterChange("region", "same-region")
                      }
                    >
                      Même région ({structureRegion})
                    </Dropdown.Item>
                  </Dropdown>
                </Col>
              </Row>
            </div>

            <div className="fr-mb-2w">
              <Row gutters>
                <Col xs="12" md="6">
                  <Dropdown
                    label={getRceLabel()}
                    icon="bank-line"
                    size="sm"
                    fullWidth
                  >
                    <Dropdown.Item
                      active={!filters.rce}
                      onClick={() => handleFilterChange("rce", "")}
                    >
                      RCE et non RCE
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.rce === "rce"}
                      onClick={() => handleFilterChange("rce", "rce")}
                    >
                      RCE uniquement
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.rce === "non-rce"}
                      onClick={() => handleFilterChange("rce", "non-rce")}
                    >
                      Non RCE uniquement
                    </Dropdown.Item>
                  </Dropdown>
                </Col>
                <Col xs="12" md="6">
                  <Dropdown
                    label={getDevimmoLabel()}
                    icon="home-4-line"
                    size="sm"
                    fullWidth
                  >
                    <Dropdown.Item
                      active={!filters.devimmo}
                      onClick={() => handleFilterChange("devimmo", "")}
                    >
                      Avec ou sans dévolution immobilière
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.devimmo === "devimmo"}
                      onClick={() => handleFilterChange("devimmo", "devimmo")}
                    >
                      Avec dévolution immobilière
                    </Dropdown.Item>
                    <Dropdown.Item
                      active={filters.devimmo === "non-devimmo"}
                      onClick={() =>
                        handleFilterChange("devimmo", "non-devimmo")
                      }
                    >
                      Sans dévolution immobilière
                    </Dropdown.Item>
                  </Dropdown>
                </Col>
              </Row>
            </div>

            <div>
              <Dropdown
                label={getTypologieLabel()}
                icon="layout-grid-line"
                size="sm"
                fullWidth
              >
                <Dropdown.Item
                  active={!filters.typologie}
                  onClick={() => handleFilterChange("typologie", "")}
                >
                  Toutes les typologies
                </Dropdown.Item>
                <Dropdown.Item
                  active={filters.typologie === "same-typologie"}
                  onClick={() =>
                    handleFilterChange("typologie", "same-typologie")
                  }
                >
                  Même typologie ({structureTypologie})
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
