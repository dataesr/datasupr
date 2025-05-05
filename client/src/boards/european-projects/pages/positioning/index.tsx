import { useEffect } from "react";
import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

// import Intro from "./charts/intro";
import Top10Beneficiaries from "./charts/top-10-beneficiaries";
import FundingRanking from "./charts/funding-ranking";

import i18n from "./i18n.json";

export default function Positioning() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }
  return (
    <Container as="main" className="fr-my-6w">
      <Title as="h1" look="h3">
        {getI18nLabel("title")}
      </Title>
      {/* <Intro /> */}
      <Top10Beneficiaries />
      <FundingRanking />
    </Container>
  );
}
