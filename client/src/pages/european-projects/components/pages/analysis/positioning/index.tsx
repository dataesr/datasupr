import { useEffect } from "react";
import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import Top10Beneficiaries from "./charts/top-10-beneficiaries";
import Intro from "./charts/intro";

export default function Positioning() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('country_code')) {
      setSearchParams({ country_code: 'FRA' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <Title as="h1" look="h3">Positionnement</Title>
      <Intro />
      <div className="fr-my-5w" />
      <Top10Beneficiaries />
      <div className="fr-my-5w" />

    </Container>
  );
}