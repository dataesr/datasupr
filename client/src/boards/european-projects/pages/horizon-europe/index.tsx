import { Container } from "@dataesr/dsfr-plus";
import EpNavigator from "../../components/ep-navigator/index";
import TabsContent from "./components/TabsContent";

import navigationConfig from "./navigation-config.json";

import "./styles.scss";
import Breadcrumb from "../../../../components/breadcrumb";

export default function HorizonEurope() {
  return (
    <>
      <Container as="main" fluid>
        <div className="ep-navigator-wrapper">
          <Container>
            <Breadcrumb config={navigationConfig} />
            <EpNavigator />
          </Container>
        </div>
        <Container>
          <TabsContent />
        </Container>
      </Container>
    </>
  );
}
