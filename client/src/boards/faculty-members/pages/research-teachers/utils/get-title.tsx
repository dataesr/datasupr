import { Text, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../../utils";
import { useFacultyMembersOverview } from "../../../api/use-overview";

interface SubtitleWithContextProps {
  classText?: string;
}

const SubtitleWithContext = ({ classText }: SubtitleWithContextProps) => {
  const [searchParams] = useSearchParams();
  const { context, contextId, contextName } = useContextDetection();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { data: allData, isLoading } = useFacultyMembersOverview({
    context,
    contextId: contextId || undefined,
  });

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const getContextParams = () => {
    if (allData?.context_info) {
      return {
        name: allData.context_info.name,
        identifiant: allData.context_info.id,
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
