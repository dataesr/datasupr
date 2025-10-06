import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "successRateForAmountsByTypeOfFinancing",
  title: "",
  subtitle: "",
  description: "Attention EIT",
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/projects-types-2",
};

export default function SuccessRateForAmountsByTypeOfFinancing() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [
      config.id,
      params,
      Cookies.get("selectedPillars"),
      Cookies.get("selectedPrograms"),
      Cookies.get("selectedTopics"),
      Cookies.get("selectedDestinations"),
    ],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper
            config={config}
            options={options(data)}
            legend={null}
            renderData={() => null} // TODO: add data table
          />
        </Col>
      </Row>
    </Container>
  );
}
