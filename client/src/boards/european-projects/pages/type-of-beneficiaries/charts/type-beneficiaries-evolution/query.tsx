const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string, entityType: string) {
  if (params === "") {
    return [];
  }
  const searchParams = new URLSearchParams(params);
  searchParams.append("cordis_type_entity_code", entityType);

  // Le composant RangeOfYears stocke les années dans "range_of_years",
  // mais le serveur attend "years"
  const rangeOfYears = searchParams.get("range_of_years");
  if (rangeOfYears) {
    searchParams.delete("range_of_years");
    searchParams.set("years", rangeOfYears);
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/type-beneficiaries/type-beneficiaries-evolution?${searchParams.toString()}`).then(
    (response) => response.json(),
  );
}
