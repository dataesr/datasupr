import { Container } from "@dataesr/dsfr-plus";
import EpNavigator from "../../components/ep-navigator";
import TabsContent from "./components/TabsContent";
import { useOverviewParams } from "./hooks/useOverviewParams";

import navigationConfig from "./navigation-config.json";

import "./styles.scss";
import Breadcrumb from "../../../../components/breadcrumb";

export default function OverviewV2() {
  const overviewParams = useOverviewParams();

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
          <TabsContent overviewParams={overviewParams} />
        </Container>
      </Container>
    </>
  );
}
