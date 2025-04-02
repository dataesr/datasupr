import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
// import FundedObjectives from "./charts/funded-objectives";
// import SynthesisFocus from "./charts/synthesis-focus";
// import MainBeneficiaries from "./charts/main-beneficiaries";
// import MainPartners from "./charts/main-partners";
import DestinationFunding from "./charts/destination-funding";
import DestinationFundingSuccessRates from "./charts/destination-funding-success-rates";

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
    // if (!searchParams.get("extra_joint_organization")) {
    //   setSearchParams({ extra_joint_organization: "all" });
    // }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      {/* <CustomTitle /> */}
      <Row>
        <Col>
          <DestinationFunding />
        </Col>
        <Col>
          <DestinationFundingSuccessRates />
        </Col>
      </Row>
      {/* <SynthesisFocus />
      <div className="fr-my-5w" />
      <FundedObjectives />
      <div className="fr-my-5w" />
      <MainBeneficiaries />
      <div className="fr-my-5w" />
      <MainPartners /> */}
    </Container>
  );
}
