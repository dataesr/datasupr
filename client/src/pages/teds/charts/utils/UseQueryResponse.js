import buildQuery from './UseBuildQuery.js';
import { useQuery } from '@tanstack/react-query';

const { VITE_APP_SERVER_URL } = import.meta.env;


function QueryResponse(body, s, i) {
    const {data, isLoading} = useQuery({
        queryKey: [`ipcc-references_${i}`],
        queryFn: () => fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=teds-bibliography`, {
          body: JSON.stringify(buildQuery(body, s)),
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          method: 'POST',
        }).then((response) => response.json())
      });

    return {data, isLoading};
};

export default QueryResponse;