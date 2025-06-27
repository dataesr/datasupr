import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useContext = ({
  contextId,
  context,
}: {
  contextId?: string;
  context: "geo" | "fields" | "structures";
}) => {
  return useQuery({
    queryKey: ["context", context, contextId],
    queryFn: async () => {
      if (!contextId) {
        return null;
      }

      const endpoints = {
        geo: "/faculty-members/filters/regions",
        fields: "/faculty-members/filters/fields",
        structures: "/faculty-members/filters/structures",
      };

      const url = `${VITE_APP_SERVER_URL}${endpoints[context]}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données pour ${context}`
        );
      }

      const data = await response.json();

      const key =
        context === "geo"
          ? "regions"
          : context === "fields"
          ? "fields"
          : "structures";
      const item = data[key]?.find(
        (item: { id: string }) => item.id === contextId
      );

      return item || null;
    },
    enabled: !!contextId,
  });
};
