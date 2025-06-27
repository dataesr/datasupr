import { Text, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../../utils";
import { useContext } from "./use-context";

interface SubtitleWithContextProps {
  classText?: string;
}

const SubtitleWithContext = ({ classText }: SubtitleWithContextProps) => {
  const [searchParams] = useSearchParams();
  const { context, contextId, contextName } = useContextDetection();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { data: structureData, isLoading } = useContext({
    contextId: contextId || undefined,
    context,
  });

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const getContextParams = () => {
    if (structureData) {
      return {
        name: structureData.lib,
        identifiant: structureData.id,
      };
    }

    return {
      name: capitalize(contextName),
      identifiant: null,
    };
  };

  const { name } = getContextParams();

  return (
    <Title look="h3" as="h2" className={classText}>
      {isLoading ? (
        <Text size="sm">Chargement...</Text>
      ) : (
        <>
          <b>{name}&nbsp;&nbsp;</b>
          <Text size="sm">Année universitaire {selectedYear}</Text>
        </>
      )}
    </Title>
  );
};

export default SubtitleWithContext;
