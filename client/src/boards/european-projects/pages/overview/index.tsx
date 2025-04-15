import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import FundedObjectives from "./charts/funded-objectives";
// import SynthesisFocus from "./charts/synthesis-focus";
// import MainBeneficiaries from "./charts/main-beneficiaries";
// import MainPartners from "./charts/main-partners";
import DestinationFunding from "./charts/destination-funding";
import DestinationFundingSuccessRates from "./charts/destination-funding-success-rates";
import DestinationFundingProportion from "./charts/destination-funding-proportion";
import PillarsFundingEvo3Years from "./charts/pillars-funding-evo-3-years";

import i18n from "./i18n.json";

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectView, setSelectView] = useState("pillars");

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
    // if (!searchParams.get("extra_joint_organization")) {
    //   setSearchParams({ extra_joint_organization: "all" });
    // }
  }, [searchParams, setSearchParams]);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }
  return (
    <Container as="main" className="fr-my-6w">
      <label className="fr-label" htmlFor="select">
        {getI18nLabel("select-title")}
      </label>
      <select
        className="fr-select"
        id="select"
        name="select"
        onChange={(e) => setSelectView(e.target.value)}
      >
        <option value="pillars">{getI18nLabel("pillars")}</option>
        <option value="programs">{getI18nLabel("programs")}</option>
        <option value="topics">{getI18nLabel("topics")}</option>
        <option value="destinations">{getI18nLabel("destinations")}</option>
      </select>

      {selectView === "pillars" ? (
        <Row>
          <Col>
            <PillarsFundingEvo3Years />
          </Col>
        </Row>
      ) : selectView === "programs" ? (
        <PillarsFundingEvo3Years />
      ) : selectView === "topics" ? (
        <PillarsFundingEvo3Years />
      ) : (
        <>
          <Row gutters>
            <Col>
              <DestinationFunding />
            </Col>
            <Col>
              <DestinationFundingSuccessRates />
            </Col>
          </Row>
          <Row>
            <Col>
              <DestinationFundingProportion />
            </Col>
          </Row>
        </>
      )}

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
