import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Col, Row, SegmentedControl, SegmentedElement, Title } from "@dataesr/dsfr-plus";

import { useGetParams } from "./utils";
import { getCollaborations, CollaborationData } from "./query";
import { getDonutOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { getContinentFromCountryCode, CONTINENT_NAMES } from "../../../../../../utils/continents";
import { formatCurrency } from "../../../../../../utils/format";
import "./styles.scss";

type ViewMode = "collaborations" | "amount";

export default function CollaborationsByContinent() {
  const [searchParams] = useSearchParams();
  const params = useGetParams();
  const currentLang = searchParams.get("language") || "fr";
  const [viewMode, setViewMode] = useState<ViewMode>("collaborations");

  const { data, isLoading } = useQuery({
    queryKey: ["CollaborationsByContinent", params],
    queryFn: () => getCollaborations(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  // Agréger les données par continent
  const continentData = data.reduce((acc: Record<string, { collaborations: number; amount: number }>, item: CollaborationData) => {
    const continent = getContinentFromCountryCode(item.country_code);
    if (!acc[continent]) {
      acc[continent] = { collaborations: 0, amount: 0 };
    }
    acc[continent].collaborations += item.total_collaborations;
    acc[continent].amount += item.total_amount || 0;
    return acc;
  }, {});

  // Convertir en format pour le chart
  const chartData = Object.entries(continentData)
    .map(([continent, values]) => ({
      name: CONTINENT_NAMES[continent]?.[currentLang] || continent,
      y: viewMode === "collaborations" ? values.collaborations : values.amount,
      continentKey: continent,
    }))
    .sort((a, b) => b.y - a.y);

  const title =
    viewMode === "collaborations" ? (currentLang === "fr" ? "Collaborations" : "Collaborations") : currentLang === "fr" ? "Montant" : "Amount";

  const chartTitle = currentLang === "fr" ? "Répartition par continent" : "Distribution by continent";

  return (
    <div>
      <Row className="fr-mt-4w collaborations-by-continent__header">
        <Col>
          <Title as="h3" look="h6" className="fr-mb-0">
            {chartTitle}
          </Title>
        </Col>
        <Col className="collaborations-by-continent__segmented-col">
          <SegmentedControl name="view-mode" onChangeValue={(value) => setViewMode(value as ViewMode)}>
            <SegmentedElement value="collaborations" label={currentLang === "fr" ? "Projets" : "Projects"} checked={viewMode === "collaborations"} />
            <SegmentedElement value="amount" label={currentLang === "fr" ? "Montant" : "Amount"} checked={viewMode === "amount"} />
          </SegmentedControl>
        </Col>
      </Row>
      <ChartWrapper config={{ id: "CollaborationsByContinent" }} options={getDonutOptions(chartData, title)} />
      <div className="collaborations-by-continent__legend">
        <ul className="collaborations-by-continent__legend-list">
          {chartData.map((item) => (
            <li key={item.name} className="collaborations-by-continent__legend-item">
              <span>{item.name}</span>
              <span className="collaborations-by-continent__legend-value">
                {viewMode === "collaborations" ? item.y.toLocaleString("fr-FR") : formatCurrency(item.y)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
