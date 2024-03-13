import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import FundedObjectives from "./charts/funded-objectives";
import SynthesisFocus from "./charts/synthesis-focus";
import ProjectsTypes1 from "./charts/projects-types-1";
import ProjectsTypes2 from "./charts/projects-types-2";
import MainBeneficiaries from "./charts/main-beneficiaries";

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('country_code')) {
      setSearchParams({ country_code: 'FRA' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <SynthesisFocus />
      <div className="fr-my-5w" />
      <FundedObjectives />
      <div className="fr-my-5w" />
      <ProjectsTypes1 />
      <div className="fr-my-5w" />
      <ProjectsTypes2 />
      <div className="fr-my-5w" />
      <MainBeneficiaries />
    </Container>
  );
}