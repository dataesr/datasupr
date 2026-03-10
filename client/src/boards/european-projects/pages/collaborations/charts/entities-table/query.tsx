const { VITE_APP_SERVER_URL } = import.meta.env;

export function buildQueryParams(searchParams: URLSearchParams): string {
  const params: string[] = [];

  // Récupérer le paramètre pillarId
  const pillarId = searchParams.get("pillarId");
  if (pillarId) {
    params.push(`pillars=${pillarId}`);
  }

  // Récupérer le paramètre programId
  const programId = searchParams.get("programId");
  if (programId) {
    params.push(`programs=${programId}`);
  }

  // Récupérer le paramètre thematicIds
  const thematicIds = searchParams.get("thematicIds");
  if (thematicIds) {
    params.push(`thematics=${thematicIds}`);
  }

  // Récupérer le paramètre destinationIds
  const destinationIds = searchParams.get("destinationIds");
  if (destinationIds) {
    params.push(`destinations=${destinationIds}`);
  }

  // Récupérer le paramètre range_of_years et le convertir en call_year pour l'API
  const rangeOfYears = searchParams.get("range_of_years");
  if (rangeOfYears) {
    const years = rangeOfYears.split("|").join(",");
    params.push(`call_year=${years}`);
  }

  return params.join("&");
}

export async function getCollaborations(entityId: string, searchParams: URLSearchParams) {
  const additionalParams = buildQueryParams(searchParams);
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations-by-entity?entity_id=${entityId}`;
  const finalUrl = additionalParams ? `${baseUrl}&${additionalParams}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}
