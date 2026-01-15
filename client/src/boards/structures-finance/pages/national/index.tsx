import { Container } from "@dataesr/dsfr-plus";
import NationalSelector from "./components/national-selector";
import NationalContent from "./components/national-content";

export default function NationalView() {
  return (
    <>
      <NationalSelector />
      <Container>
        <NationalContent />
      </Container>
    </>
  );
}
