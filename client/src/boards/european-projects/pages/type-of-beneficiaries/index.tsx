import { Container, Title } from "@dataesr/dsfr-plus";
import Callout from "../../../../components/callout";
import Top10CountriesByTypeOfBeneficiaries from "./charts/top-10-beneficiaries";
import TypeOfBeneficiariesEvolution from "./charts/type-beneficiaries-evolution";

export default function TypeOfBeneficiaries() {
  return (
    <Container as="main">
      <div className="fr-my-5w" />
      {/* <div className="sticky"> */}
      <Title as="h1" look="h3">
        Types de bénéficiaires
      </Title>
      <Callout>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus hic inventore ipsum pariatur possimus est voluptatibus ut aspernatur
        itaque quae. Eveniet, numquam? Soluta fugit cupiditate et molestias. Tenetur, quod eligendi!
      </Callout>

      <div className="fr-my-5w" />
      <Top10CountriesByTypeOfBeneficiaries />
      <div className="fr-my-5w" />
      <TypeOfBeneficiariesEvolution />
    </Container>
  );
}
