import { useEffect, useState } from "react";
import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import Top10Beneficiaries from "./charts/top-10-beneficiaries";
import Intro from "./charts/intro";
import FundingRanking from "./charts/funding-ranking";

export default function Positioning() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChart, setSelectedChart] = useState("fundingRankingSub");

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <Title as="h1" look="h3">
        Positionnement
      </Title>
      <Intro />
      <div className="fr-my-5w" />
      <Top10Beneficiaries />

      <div className="fr-my-5w" />
      <Title as="h2" look="h4">
        Top 10 par indicateur
      </Title>
      <select
        className="fr-select fr-mb-3w"
        onChange={(e) => setSelectedChart(e.target.value)}
        value={selectedChart}
      >
        <option value="fundingRankingSub">Focus sur les subventions</option>
        <option value="fundingRankingCoordination">
          Focus sur les coordinations de projets
        </option>
        <option value="fundingRankingInvolved">
          Focus sur les candidats et participants
        </option>
      </select>
      <FundingRanking indicateurId={selectedChart} />
    </Container>
  );
}
