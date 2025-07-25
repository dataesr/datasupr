import { Title } from "@dataesr/dsfr-plus";
import { useContextDetection } from "../utils";
import { useFacultyMembersTypology } from "../api/use-typology";

const SubtitleWithContext = () => {
  const { context, contextId, contextName } = useContextDetection();

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
          plural: "Le personnel enseignants au niveau national",
        };
      case "geo":
        if (isAcademie) {
          return {
            name:
              typologyData?.academie?._id?.item_name ||
              typologyData?.region?._id?.item_name,
            identifiant: null,
            prefix: "Académie de ",
            plural: "Le personnel enseignants au niveau national",
          };
        }
        return {
          name: typologyData?.region?._id?.item_name,
          identifiant: null,
          prefix: "Région ",
          plural: "Le personnel enseignants au niveau national",
        };
      case "structures":
        return {
          name: typologyData?.structure?._id?.item_name,
          identifiant: null,
          plural: "Le personnel enseignants au niveau national",
        };
      default:
        return {
          name: contextNameCapital,
          identifiant: null,
        };
    }
  };

  const contextNameCapital = capitalize(contextName);

  const { name, prefix, plural = "" } = getContextParams();

  return (
    <>
      <Title as="h2" look="h1" className="fr-text-title--blue-france fr-mt-3w">
        {!contextId && plural}
        {contextId && prefix}
        {name}&nbsp; <br />
      </Title>
    </>
  );
};

export default SubtitleWithContext;
