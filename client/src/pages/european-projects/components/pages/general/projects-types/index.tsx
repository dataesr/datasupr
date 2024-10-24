import { Container, Notice, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";

// import PillarsRequestedByProjects from "./charts/pillars-requested-by-projects";
import PillarsSubsidiesRequestedLines from "./charts/pillars-subsidies-requested-lines";
// import SuccessRateAndEvolutionByPillar from "./charts/success-rate-and-evolution-by-pillar";

// import TypeOfFinancingSubsidiesRequestedByProjects from "./charts/type-of-financing-subsidies-requested-by-projects";
// import TypeOfFinancingSubsidiesRequestedLines from "./charts/type-of-financing-subsidies-requested-lines";
// import SuccessRateForAmountsByTypeOfFinancing from "./charts/success-rate-for-amounts-by-type-of-financing";

export default function ProjectsTypes() {
  const [selectedChart, setSelectedChart] = useState("Subsidies");

  return (
    <Container as="main">
      <div className="sticky">
        <Title as="h1" look="h3">
          Objectifs et types de projets
        </Title>
        <Notice closeMode={"disallow"} type={"info"}>
          Méthodo de la page <br />
          Adipisicing do excepteur tempor mollit exercitation fugiat non.
        </Notice>
        <select
          className="fr-select fr-my-1w"
          onChange={(e) => setSelectedChart(e.target.value)}
          value={selectedChart}
        >
          <option value="Subsidies">Focus sur les subventions</option>
          <option value="ProjectCoordination">
            Focus sur les coordinations de projets
          </option>
          <option value="ApplicantsAndParticipants">
            Focus sur les candidats et participants
          </option>
          {/* <option value="projects">Projets</option> */}
        </select>
      </div>

      <Title as="h2" look="h4">
        Par pilier
      </Title>
      {/* <PillarsRequestedByProjects
        indicateurId={`pillars${selectedChart}RequestedByProjects`}
      /> */}
      <div className="fr-my-5w" />
      <PillarsSubsidiesRequestedLines
        indicateurId={`pillars${selectedChart}RequestedByProjectsLines`}
      />
      {/* <div className="fr-my-5w" />
      <SuccessRateAndEvolutionByPillar
        indicateurId={`pillars${selectedChart}RequestedByRates`}
      />
      <div className="fr-my-5w" />
      <Title as="h2" look="h4">
        Par type de projets
      </Title>
      <TypeOfFinancingSubsidiesRequestedByProjects />
      <div className="fr-my-5w" />
      <TypeOfFinancingSubsidiesRequestedLines />
      <div className="fr-my-5w" />
      <SuccessRateForAmountsByTypeOfFinancing /> */}
    </Container>
  );
}
