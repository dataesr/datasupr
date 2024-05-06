import { useQuery } from "@tanstack/react-query";

import { getBuildQuery } from "./utils";

const { VITE_APP_SERVER_URL } = import.meta.env;

// eslint-disable-next-line no-redeclare
function useQueryResponse(body, s, i) {
  const { data, isLoading } = useQuery({
    queryKey: [`ipcc-references_${i}`],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=teds-bibliography`, {
        body: JSON.stringify(getBuildQuery(body, s)),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  return { data, isLoading };
}

export { useQueryResponse };
