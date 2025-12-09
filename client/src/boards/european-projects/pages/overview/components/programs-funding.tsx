import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "@dataesr/dsfr-plus";

import ProgramsFundingValues from "../charts/programs-funding";
import ProgramsFundingSuccessRates from "../charts/programs-funding-success-rates";
import ProgramsFundingProportion from "../charts/programs-funding-proportion";
import ChartFooter from "../../../../../components/chart-footer";
import { EPChartsSource, EPChartsUpdateDate } from "../../../config";
import { readingKey, useGetParams } from "../charts/programs-funding/utils";
import { getData } from "../charts/programs-funding/query";

export default function ProgramsFunding() {
  const { params } = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["programsFunding", params],
    queryFn: () => getData(params),
  });

  return (
    <>
      <Row className="chart-container chart-container--pillars" style={{ marginLeft: "var(--spacing-1w)", marginRight: "var(--spacing-1w)" }}>
        <Col md={6}>
          <ProgramsFundingValues />
        </Col>
        <Col md={6}>
          <ProgramsFundingSuccessRates />
        </Col>
        <Col md={12} className="chart-footer">
          <ChartFooter
            comment={{
              fr: (
                <>
                  Ce graphique affiche la répartition des financements demandés et obtenus (en M€) par pilier, ainsi que le taux de succès associé
                  (montants obtenus / montants demandés).
                </>
              ),
              en: (
                <>
                  This chart displays the distribution of requested and obtained funding (in M€) by pillar, as well as the associated success rate
                  (amounts obtained / amounts requested).
                </>
              ),
            }}
            readingKey={readingKey(data, isLoading)}
            source={EPChartsSource}
            updateDate={EPChartsUpdateDate}
          />
        </Col>
      </Row>
      <Row className="fr-mt-1w chart-container chart-container--pillars">
        <Col>
          <ProgramsFundingProportion />
        </Col>
      </Row>
    </>
  );
}
