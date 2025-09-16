import { Title, Badge } from "@dataesr/dsfr-plus";
import { useContextDetection } from "../utils";
import { useFacultyMembersTypology } from "../api/use-typology";
import { useLocation } from "react-router-dom";
import { useFacultyMembersYears } from "../api/general-queries";

const TitleWithContext = () => {
  const { context, contextId, contextName } = useContextDetection();
  const location = useLocation();

  const { data: yearsData } = useFacultyMembersYears();
  const isAcademie = context === "geo" && contextId?.toString().startsWith("A");

  const { data: typologyData } = useFacultyMembersTypology({
    context,
    contextId: contextId || undefined,
  });

  const isEstablishmentClosed =
    context === "structures" && yearsData?.context?.has_closure_date;
  const fermetureYear = yearsData?.context?.closure_year;

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const getContextParams = () => {
    switch (context) {
      case "fields":
        return {
          name: typologyData?.[0]?.name || contextName,
          identifiant: typologyData?.[0]?.id,
          pluralMain: "Le personnel enseignant au niveau national",
          pluralSub: "(toutes les disciplines)",
        };
      case "geo":
        if (isAcademie) {
          return {
            name: typologyData?.[0]?.name || contextName,
            identifiant: null,
            prefix: "Académie de ",
            pluralMain: "Le personnel enseignant au niveau national",
            pluralSub: "(toutes les académies)",
          };
        }
        return {
          name: typologyData?.[0]?.name || contextName,
          identifiant: null,
          prefix: "Région ",
          pluralMain: "Le personnel enseignant au niveau national",
          pluralSub: "(toutes les régions)",
        };
      case "structures":
        return {
          name: typologyData?.[0]?.name || contextName,
          identifiant: null,
          pluralMain: "Le personnel enseignant au niveau national",
          pluralSub: "(tous les établissements)",
        };
      default:
        return {
          name: contextNameCapital,
          identifiant: null,
        };
    }
  };

  const contextNameCapital = capitalize(contextName);

  const { name, prefix, pluralMain, pluralSub } = getContextParams();

  if (location.pathname.startsWith("/personnel-enseignant/glossaire")) {
    return (
      <Title as="h2" look="h1" className="fr-text-title--blue-france fr-mt-3w">
        Glossaire
      </Title>
    );
  }

  return (
    <>
      <Title as="h2" look="h1" className="fr-text-title--blue-france fr-mt-2w">
        {!contextId && (
          <>
            {pluralMain}{" "}
            <span style={{ fontSize: "0.5em", verticalAlign: "middle" }}>
              {pluralSub}
            </span>
          </>
        )}
        {contextId && prefix}
        <br />
        {name}
        {isEstablishmentClosed && (
          <>
            {" "}
            <br />
            <Badge
              variant="error"
              size="sm"
              style={{ verticalAlign: "middle" }}
            >
              Fermé{fermetureYear ? ` depuis ${fermetureYear}` : ""}
            </Badge>
          </>
        )}
      </Title>
    </>
  );
};

export default TitleWithContext;
