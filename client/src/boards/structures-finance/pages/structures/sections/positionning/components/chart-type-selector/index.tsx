import { Row, Col, Text } from "@dataesr/dsfr-plus";
import { Select } from "../../../../../../components/select";
import { type ChartView } from "../../charts";

interface ChartTypeSelectorProps {
  activeChart: ChartView;
  onChartChange: (chart: ChartView) => void;
}

export default function ChartTypeSelector({
  activeChart,
  onChartChange,
}: ChartTypeSelectorProps) {
  const getChartLabel = () => {
    if (activeChart === "comparison") return "Comparaison par analyse";
    if (activeChart === "scatter-1") return "Produits vs Effectifs";
    if (activeChart === "scatter-2") return "SCSP vs Encadrement";
    if (activeChart === "scatter-3") return "SCSP vs Ressources";
    return "Comparaison par analyse";
  };

  return (
    <Row gutters className="fr-mb-3w">
      <Col xs="12" md="4" offsetMd="8" className="text-right">
        <Text className="fr-text--sm fr-text--bold fr-mb-1w">
          Type de graphique
        </Text>
        <Select label={getChartLabel()} icon="line-chart-line" size="sm">
          <Select.Checkbox
            value="comparison"
            checked={activeChart === "comparison"}
            onChange={() => onChartChange("comparison")}
          >
            Comparaison par analyse
          </Select.Checkbox>
          <Select.Checkbox
            value="scatter-1"
            checked={activeChart === "scatter-1"}
            onChange={() => onChartChange("scatter-1")}
          >
            Produits vs Effectifs
          </Select.Checkbox>
          <Select.Checkbox
            value="scatter-2"
            checked={activeChart === "scatter-2"}
            onChange={() => onChartChange("scatter-2")}
          >
            SCSP vs Encadrement
          </Select.Checkbox>
          <Select.Checkbox
            value="scatter-3"
            checked={activeChart === "scatter-3"}
            onChange={() => onChartChange("scatter-3")}
          >
            SCSP vs Ressources
          </Select.Checkbox>
        </Select>
      </Col>
    </Row>
  );
}
