import { useSearchParams } from "react-router-dom";
import TertiaryNavigation, {
  TertiaryNavigationItem,
} from "../../../../../components/tertiary-navigation";

export default function SectionNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "financements";

  const handleSectionChange = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next);
  };

  return (
    <div className="fr-mb-3w">
      <TertiaryNavigation>
        <TertiaryNavigationItem
          label="Les ressources de l'établissement"
          isActive={activeSection === "financements"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("financements");
          }}
        />
        <TertiaryNavigationItem
          label="Moyens humains"
          isActive={activeSection === "moyens-humains"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("moyens-humains");
          }}
        />
        <TertiaryNavigationItem
          label="Ressources propres"
          isActive={activeSection === "recettes-propres"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("recettes-propres");
          }}
        />
        <TertiaryNavigationItem
          label="Étudiants inscrits"
          isActive={activeSection === "etudiants"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("etudiants");
          }}
        />
        <TertiaryNavigationItem
          label="Analyses et évolutions"
          isActive={activeSection === "analyses"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("analyses");
          }}
        />
      </TertiaryNavigation>
    </div>
  );
}
