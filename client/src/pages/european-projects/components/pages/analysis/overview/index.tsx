import { Container } from "@dataesr/dsfr-plus";
import FundedObjectives from "./charts/funded-objectives";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('country_code') === null) {
      setSearchParams({ country_code: 'FRA' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      {/* <Focus /> */}
      <FundedObjectives />
    </Container>
  );
}