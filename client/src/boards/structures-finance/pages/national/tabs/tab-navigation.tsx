import { TabButton } from "../../../components/tab-button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="fr-mb-3w">
      <div className="fr-tabs">
        <ul
          className="fr-tabs__list"
          role="tablist"
          aria-label="Analyses disponibles"
        >
          <TabButton
            id="tab-scatter1"
            label="Produits vs Effectifs d'étudiants"
            isActive={activeTab === "scatter1"}
            tabPanelId="tabpanel-scatter1"
            onClick={() => onTabChange("scatter1")}
          />
          <TabButton
            id="tab-scatter2"
            label="SCSP vs Encadrement"
            isActive={activeTab === "scatter2"}
            tabPanelId="tabpanel-scatter2"
            onClick={() => onTabChange("scatter2")}
          />
          <TabButton
            id="tab-scatter3"
            label="SCSP vs Ressources propres"
            isActive={activeTab === "scatter3"}
            tabPanelId="tabpanel-scatter3"
            onClick={() => onTabChange("scatter3")}
          />
          <TabButton
            id="tab-comparison"
            label="Comparaison de métriques"
            isActive={activeTab === "comparison"}
            tabPanelId="tabpanel-comparison"
            onClick={() => onTabChange("comparison")}
          />
        </ul>
      </div>
    </div>
  );
}
