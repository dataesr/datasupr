import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import ProjectsTypes1 from "./charts/projects-types-1";
import ProjectsTypes2 from "./charts/projects-types-2";

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
        Par type de projets
      </Title>
      <ProjectsTypes1 />
      <div className="fr-my-5w" />
      <ProjectsTypes2 />
    </Container>
  );
}
