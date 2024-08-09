import { Container, Text, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import PillarsSubsidiesRequestedByProjects from "./charts/pillars-subsidies-requested-by-projects";
import PillarsSubsidiesRequestedLines from "./charts/pillars-subsidies-requested-lines";
import SuccessRateForAmountsByPillar from "./charts/success-rate-for-amounts-by-pillar";

import TypeOfFinancingSubsidiesRequestedByProjects from "./charts/type-of-financing-subsidies-requested-by-projects";
import TypeOfFinancingSubsidiesRequestedLines from "./charts/type-of-financing-subsidies-requested-lines";
import SuccessRateForAmountsByTypeOfFinancing from "./charts/success-rate-for-amounts-by-type-of-financing";

export default function ProjectsTypes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCharts, setSelectedCharts] = useState("fundingRankingSub");

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <Title as="h1" look="h3">
        Objectifs et types de projets
      </Title>
      <div className="fr-notice__body">
        <Text>La synthèse porte sur l'ensemble des acteurs du PCRI</Text>
      </div>
      <select
        className="fr-select fr-mb-3w"
        onChange={(e) => setSelectedCharts(e.target.value)}
        value={selectedCharts}
      >
        <option value="subsidies">Subventions</option>
        <option value="projectCoordination">Coordinations de projets</option>
        <option value="applicantsAndParticipants">
          Candidats et participants
        </option>
        <option value="projects">Projets</option>
      </select>

      <Title as="h2" look="h4">
        Par pilier
      </Title>
      <PillarsSubsidiesRequestedByProjects />
      <div className="fr-my-5w" />
      <PillarsSubsidiesRequestedLines />
      <div className="fr-my-5w" />
      <SuccessRateForAmountsByPillar />
      <div className="fr-my-5w" />

      <Title as="h2" look="h4">
        Par type de projets
      </Title>
      <TypeOfFinancingSubsidiesRequestedByProjects />
      <div className="fr-my-5w" />
      <TypeOfFinancingSubsidiesRequestedLines />
      <div className="fr-my-5w" />
      <SuccessRateForAmountsByTypeOfFinancing />
    </Container>
  );
}
