import { useEffect } from "react";
import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import Intro from "./charts/intro";
import Top10Beneficiaries from "./charts/top-10-beneficiaries";
// import FundingRanking from "./charts/funding-ranking";

// import i18n from "./i18n.json";
import Callout from "../../../../components/callout";
import FundingEvo3Years from "./charts/funding-evo-3-years";

export default function Positioning() {
  const [searchParams, setSearchParams] = useSearchParams();
  // const currentLang = searchParams.get("language") || "fr";

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }
  return (
    <Container as="main" className="fr-my-6w">
      <Callout className="callout-style-positioning">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorum impedit in nisi quibusdam, consequuntur omnis. Qui at error aliquam atque
        natus facilis, reiciendis alias perferendis tenetur minus quae rerum?
      </Callout>

      <Intro />
      <Top10Beneficiaries />
      {/* <FundingRanking /> */}
      <FundingEvo3Years />
    </Container>
  );
}
