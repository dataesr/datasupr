import { useEffect, useState } from "react";
import { Container } from "@dataesr/dsfr-plus";
import EpNavigator from "../../components/ep-navigator/index";
import TabsContent from "./components/TabsContent";

import navigationConfig from "./navigation-config.json";

import "./styles.scss";
import Breadcrumb from "../../../../components/breadcrumb";

export default function HorizonEurope() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setCollapsed(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Container as="main" fluid>
        <div className={`ep-navigator-wrapper${collapsed ? " ep-navigator-wrapper--collapsed" : ""}`}>
          <Container>
            <Breadcrumb config={navigationConfig} />
            <EpNavigator />
          </Container>
        </div>
        <Container as="section">
          <TabsContent />
        </Container>
      </Container>
    </>
  );
}
