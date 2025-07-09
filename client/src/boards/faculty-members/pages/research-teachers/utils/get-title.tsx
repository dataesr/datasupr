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

  const isAcademie = context === "geo" && contextId?.toString().startsWith("A");

  const { data: structureData, isLoading } = useContext({
    contextId: contextId || undefined,
    context,
  });

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const getContextParams = () => {
    if (!contextId) {
      return {
        name: null,
        identifiant: null,
        prefix: "",
      };
    }

    if (structureData) {
      if (isAcademie) {
        return {
          name: structureData.lib,
          identifiant: structureData.id,
          prefix: "Académie de ",
        };
      }

      if (context === "geo" && !isAcademie) {
        return {
          name: structureData.lib,
          identifiant: structureData.id,
          prefix: "Région ",
        };
      }

      return {
        name: structureData.lib,
        identifiant: structureData.id,
        prefix: "",
      };
    }

    if (isAcademie) {
      return {
        name: capitalize(contextName),
        identifiant: null,
        prefix: "Académie de ",
      };
    } else if (context === "geo") {
      return {
        name: capitalize(contextName),
        identifiant: null,
        prefix: "Région ",
      };
    }

    return {
      name: capitalize(contextName),
      identifiant: null,
      prefix: "",
    };
  };

  const { name, prefix = "" } = getContextParams();

  return (
    <Title look="h3" as="h2" className={classText}>
      {isLoading ? (
        <Text size="sm">Chargement...</Text>
      ) : (
        <>
          {name && (
            <b>
              {prefix}
              {name}&nbsp;&nbsp;
            </b>
          )}
          <Text size="sm">Année universitaire {selectedYear}</Text>
        </>
      )}
    </Title>
  );
};

export default SubtitleWithContext;
