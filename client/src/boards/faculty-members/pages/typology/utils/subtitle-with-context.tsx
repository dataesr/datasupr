import { useSearchParams } from "react-router-dom";
import { Text } from "@dataesr/dsfr-plus";
import { useContextDetection } from "../../../utils";
import { useFacultyMembersTypology } from "../../../api/use-typology";

interface SubtitleWithContextProps {
  classText: string;
}

const SubtitleWithContext = ({ classText }: SubtitleWithContextProps) => {
  const [searchParams] = useSearchParams();
  const { context, contextId, contextName } = useContextDetection();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const isAcademie = context === "geo" && contextId?.toString().startsWith("A");

  const { data: typologyData } = useFacultyMembersTypology({
    context,
    contextId: contextId || undefined,
  });

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const getContextParams = () => {
    switch (context) {
      case "fields":
        return {
          name: typologyData?.discipline?._id?.item_name,
          identifiant: typologyData?.discipline?._id?.item_code,
          plural: "Toutes les disciplines",
        };
      case "geo":
        if (isAcademie) {
          return {
            name:
              typologyData?.academie?._id?.item_name ||
              typologyData?.region?._id?.item_name,
            identifiant: null,
            prefix: "Académie de ",
            plural: "Toutes les académies",
          };
        }
        return {
          name: typologyData?.region?._id?.item_name,
          identifiant: null,
          prefix: "Région",
          plural: "Toute la France",
        };
      case "structures":
        return {
          name: typologyData?.structure?._id?.item_name,
          identifiant: null,
          plural: "Tous les établissements",
        };
      default:
        return {
          name: contextNameCapital,
          identifiant: null,
        };
    }
  };

  const contextNameCapital = capitalize(contextName);

  const { name, identifiant, prefix, plural = "" } = getContextParams();

  return (
    <Text className={classText}>
      Année universitaire {selectedYear}&nbsp;-&nbsp;
      {!contextId && plural}
      {contextId && prefix}
      {name}&nbsp;{identifiant}
    </Text>
  );
};

export default SubtitleWithContext;
