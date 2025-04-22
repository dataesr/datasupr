import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import FundedObjectives from "./charts/funded-objectives";
// import SynthesisFocus from "./charts/synthesis-focus";
// import MainBeneficiaries from "./charts/main-beneficiaries";
// import MainPartners from "./charts/main-partners";

import PillarsFundingEvo3Years from "./charts/pillars-funding-evo-3-years";
import ProgramsFundingEvo3Years from "./charts/programs-funding-evo-3-years";

import i18n from "./i18n.json";
import TopicsFundingEvo3Years from "./charts/topics-funding-evo-3-years";
import DestinationsFundingEvo3Years from "./charts/destinations-funding-evo-3-years";
import DestinationsFunding from "./components/destinations-funding";
import PillarsFunding from "./components/pillars-funding";
import ProgramsFunding from "./components/programs-funding";
import TopicsFunding from "./components/topics-funding";

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

      {selectView === "pillars" && (
        <>
          <Title as="h2" className="fr-my-5w">
            {getI18nLabel("title1-pillars")}
          </Title>
          <PillarsFunding />
          <Title as="h2" className="fr-my-5w">
            {getI18nLabel("title2-pillars")}
          </Title>
          <PillarsFundingEvo3Years />
        </>
      )}
      {selectView === "programs" && (
        <>
          <ProgramsFunding />
          <ProgramsFundingEvo3Years />
        </>
      )}
      {selectView === "topics" && (
        <>
          <TopicsFunding />
          <TopicsFundingEvo3Years />
        </>
      )}
      {selectView === "destinations" && (
        <>
          <DestinationsFunding />
          <DestinationsFundingEvo3Years />
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
