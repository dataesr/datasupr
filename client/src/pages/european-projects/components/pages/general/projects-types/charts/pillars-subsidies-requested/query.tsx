const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/general-objectives-and-projects-types-piliers-subventions-2`;
  if (params !== "") {
    url = `${VITE_APP_SERVER_URL}/european-projects/general-objectives-and-projects-types-piliers-subventions-2?${params}`;
  }

  return fetch(url).then((response) => response.json());
}
