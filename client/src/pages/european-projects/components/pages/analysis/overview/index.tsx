import { Container } from "@dataesr/dsfr-plus";
import Horizon2020Participation from "./charts/funded-objectives";

export default function Overview() {
  return (
    <Container as="main">
      {/* <Focus /> */}
      <Horizon2020Participation />
    </Container>
  );
}