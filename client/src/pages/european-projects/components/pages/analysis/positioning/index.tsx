import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Top10Beneficiaries from "./charts/top-10-beneficiaries";

export default function Positioning() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('country_code') === null) {
      setSearchParams({ country_code: 'FRA' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <Top10Beneficiaries />
      <div className="fr-my-5w" />

    </Container>
  );
}