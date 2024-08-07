import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import ProjectsTypesPiliers1 from "./charts/projects-types-piliers-1";
import ProjectsTypes1 from "./charts/projects-types-1";
import SuccessRateForAmountsByTypeOfFinancing from "./charts/success-rate-for-amounts-by-type-of-financing";
import ProjectsTypesPillarsSubsidiesRequested from "./charts/projects-types-pillars-subsidies-requested";
import SuccessRateForAmountsByPillar from "./charts/success-rate-for-amounts-by-pillar";

export default function ProjectsTypes() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <Title as="h2" look="h4">
        Par pilier
      </Title>
      <ProjectsTypesPiliers1 />
      <div className="fr-my-5w" />
      <ProjectsTypesPillarsSubsidiesRequested />
      <div className="fr-my-5w" />
      <SuccessRateForAmountsByPillar />
      <div className="fr-my-5w" />

      <Title as="h2" look="h4">
        Par type de projets
      </Title>
      <ProjectsTypes1 />
      <div className="fr-my-5w" />
      <SuccessRateForAmountsByTypeOfFinancing />
    </Container>
  );
}
