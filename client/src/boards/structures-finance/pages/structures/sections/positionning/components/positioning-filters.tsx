import { Row, Col } from "@dataesr/dsfr-plus";
import Dropdown from "../../../../../../../components/dropdown";
import "./positioning-filters.scss";

type FilterMode = "all" | "same-type" | "same-typologie" | "same-region";

interface PositioningFiltersProps {
  data: any[];
  currentStructure: any;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
}

export default function PositioningFilters({
  currentStructure,
  filterMode,
  onFilterModeChange,
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

  const getFilterLabel = () => {
    switch (filterMode) {
      case "same-type":
        return `Même type (${structureType})`;
      case "same-typologie":
        return `Même typologie (${structureTypologie})`;
      case "same-region":
        return `Même région (${structureRegion})`;
      default:
        return "Tous les établissements";
    }
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
              <span className="fr-text--sm  fr-text--bold text-mention-grey">
                Filtrer la comparaison
              </span>
            </div>
            <Dropdown label={getFilterLabel()} size="sm" fullWidth>
              <Dropdown.Item
                active={filterMode === "all"}
                onClick={() => onFilterModeChange("all")}
              >
                Tous les établissements
              </Dropdown.Item>
              <Dropdown.Item
                active={filterMode === "same-type"}
                onClick={() => onFilterModeChange("same-type")}
              >
                Même type ({structureType})
              </Dropdown.Item>
              <Dropdown.Item
                active={filterMode === "same-typologie"}
                onClick={() => onFilterModeChange("same-typologie")}
              >
                Même typologie ({structureTypologie})
              </Dropdown.Item>
              <Dropdown.Item
                active={filterMode === "same-region"}
                onClick={() => onFilterModeChange("same-region")}
              >
                Même région ({structureRegion})
              </Dropdown.Item>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export type { FilterMode };
