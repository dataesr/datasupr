import { Container } from "@dataesr/dsfr-plus";
import EpNavigator from "../../components/ep-navigator";
import TabsContent from "./components/TabsContent";
import { useOverviewParams } from "./hooks/useOverviewParams";
import "./styles.scss";

export default function OverviewV2() {
  const overviewParams = useOverviewParams();

  return (
    <>
      <Container as="main">
        <div className="ep-navigator-wrapper">
          <EpNavigator />
        </div>
        <TabsContent overviewParams={overviewParams} />
      </Container>
    </>
  );
}
