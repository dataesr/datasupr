import { Container } from "@dataesr/dsfr-plus";
import EpNavigator from "../../components/ep-navigator";
import TabsContent from "./components/TabsContent";
import { useOverviewParams } from "./hooks/useOverviewParams";

export default function OverviewV2() {
  const overviewParams = useOverviewParams();

  return (
    <>
      <Container as="main" className="fr-mt-4w fr-mb-3w">
        <EpNavigator />
      </Container>
      <Container as="section" fluid className="fr-py-1w">
        <Container as="main">
          <TabsContent overviewParams={overviewParams} />
        </Container>
      </Container>
    </>
  );
}
