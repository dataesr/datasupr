import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import optionsSubsidiesValues from "./options-subsidies_values";
import optionsSubsidiesRates from "./options-subsidies_rates";
import optionsCoordinationNumber from "./options-coordination_number_values";
import OptionsCoordinationNumberRates from "./options-coordination_number_rates";

import ChartWrapper from "../../../../../chart-wrapper";
import { getDefaultParams } from "./utils";
import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { GetLegend } from "../../../../../legend";
import DefaultSkeleton from "../../../../../charts-skeletons/default";
import {
  RenderDataSubsidiesValues,
  RenderDataSubsidiesRates,
  RenderDataCoordinationNumberValues,
  RenderDataCoordinationNumberRates,
} from "./render-data";

export default function PillarsSubsidiesRequestedByProjects({ indicateurId }) {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [indicateurId, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton col={2} />;

  let options, optionsRates;
  let renderDataValues, renderDataRates;
  switch (indicateurId) {
    case "pillarsSubsidiesRequestedByProjects":
      options = optionsSubsidiesValues(data);
      optionsRates = optionsSubsidiesRates(data);
      renderDataValues = RenderDataSubsidiesValues;
      renderDataRates = RenderDataSubsidiesRates;
      break;

    case "pillarsProjectCoordinationRequestedByProjects":
      options = optionsCoordinationNumber(data);
      optionsRates = OptionsCoordinationNumberRates(data);
      renderDataValues = RenderDataCoordinationNumberValues;
      renderDataRates = RenderDataCoordinationNumberRates;
      break;

    // case "pillarsApplicantsAndParticipantsRequestedByProjects":
    //   options = optionsSubsidiesValues(data);
    //   optionsRates = optionsSubsidiesRates(data);
    //   break;

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
          <ChartWrapper
            id={indicateurId}
            legend={legend}
            options={options}
            renderData={renderDataValues}
          />
        </Col>
        <Col>
          <ChartWrapper
            id={`${indicateurId}Rates`}
            legend={null}
            options={optionsRates}
            renderData={renderDataRates}
          />
        </Col>
      </Row>
    </Container>
  );
}
