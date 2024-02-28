import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import FundedObjectives from "./charts/funded-objectives";
import SynthesisFocus from "./charts/synthesis-focus";

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('country_code') === null) {
      setSearchParams({ country_code: 'FRA' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <SynthesisFocus />
      <div className="fr-my-5w" />
      <FundedObjectives />
    </Container>
  );
}