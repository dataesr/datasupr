import { useEffect } from "react";
import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import Callout from "../../../../components/callout";
import EntityVariablePie from "./charts/entity-variable-pie";
import EntitySearchBar from "../../components/entity-searchbar";
// import i18n from "./i18n.json";

export default function CollaborationsEntity({ entityId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const currentLang = searchParams.get("language") || "fr";

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }

  return (
    <Container as="main" className="fr-my-6w">
      <Callout className="callout-style-collaboration-entity">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorum impedit in nisi quibusdam, consequuntur omnis. Qui at error aliquam atque
        natus facilis, reiciendis alias perferendis tenetur minus quae rerum?
      </Callout>

      {(!entityId || entityId === "entityId") && <EntitySearchBar />}
      {entityId && entityId !== "entityId" && (
        <>
          <EntityVariablePie />
        </>
      )}
    </Container>
  );
}
