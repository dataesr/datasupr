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
        };
      case "geo":
        return {
          name: typologyData?.region?._id?.item_name,
          identifiant: null,
        };
      case "structures":
        return {
          name: typologyData?.structure?._id?.item_name,
          identifiant: null,
        };
      default:
        return {
          name: contextNameCapital,
          identifiant: null,
        };
    }
  };

  const contextNameCapital = capitalize(contextName);

  const { name, identifiant } = getContextParams();

  return (
    <Text className={classText}>
      Année universitaire {selectedYear}&nbsp;-&nbsp;
      {!contextId && contextNameCapital}
      {name}&nbsp;{identifiant}
    </Text>
  );
};

export default SubtitleWithContext;
