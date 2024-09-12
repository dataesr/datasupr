import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies_values";
import optionsSubsidiesRates from "./options-subsidies_rates";
import optionsCoordinationNumber from "./options-coordination_number_values";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { GetLegend } from "../../../../../legend";
import OptionsCoordinationNumberRates from "./options-coordination_number_rates";

export default function PillarsSubsidiesRequestedByProjects({ indicateurId }) {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [indicateurId, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;

  let options, optionsRates;
  switch (indicateurId) {
    case "pillarsSubsidiesRequestedByProjects":
      options = optionsSubsidiesValues(data);
      optionsRates = optionsSubsidiesRates(data);
      break;

    case "pillarsProjectCoordinationRequestedByProjects":
      options = optionsCoordinationNumber(data);
      optionsRates = OptionsCoordinationNumberRates(data);
      break;

    case "pillarsApplicantsAndParticipantsRequestedByProjects":
      options = optionsSubsidiesValues(data);
      optionsRates = optionsSubsidiesRates(data);
      break;

    default:
      break;
  }

  const legend = GetLegend(
    [
      ["Projets lauréats", "#233E41"],
      ["Projets évalués", "#009099"],
    ],
    "PillarsSubsidiesRequestedByProjects"
  );

  return (
    <Container fluid>
      <Row>
        <Col>
          <ChartWrapper id={indicateurId} options={options} legend={legend} />
        </Col>
        <Col>
          <ChartWrapper
            id={`${indicateurId}Rates`}
            options={optionsRates}
            legend={null}
          />
        </Col>
      </Row>
    </Container>
  );
}
