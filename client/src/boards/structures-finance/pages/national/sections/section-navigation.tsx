import { useSearchParams } from "react-router-dom";
import TertiaryNavigation, {
  TertiaryNavigationItem,
} from "../../../../../components/tertiary-navigation";

export default function SectionNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "produits-vs-etudiants";

  const handleSectionChange = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        borderBottom: "2px solid var(--border-default-grey)",
      }}
    >
      {" "}
      <TertiaryNavigation>
        <TertiaryNavigationItem
          label="Produits vs Effectifs d'étudiants"
          isActive={activeSection === "produits-vs-etudiants"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("produits-vs-etudiants");
          }}
        />
        <TertiaryNavigationItem
          label="SCSP vs Encadrement"
          isActive={activeSection === "scsp-vs-encadrement"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("scsp-vs-encadrement");
          }}
        />
        <TertiaryNavigationItem
          label="SCSP vs Ressources propres"
          isActive={activeSection === "scsp-vs-ressources-propres"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("scsp-vs-ressources-propres");
          }}
        />
        <TertiaryNavigationItem
          label="Comparaison de métriques"
          isActive={activeSection === "comparison"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("comparison");
          }}
        />
      </TertiaryNavigation>
    </div>
  );
}
