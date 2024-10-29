const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetfundedObjectives(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/funded-objectives`;
  if (params !== "") {
    url = `${VITE_APP_SERVER_URL}/european-projects/funded-objectives?${params}`;
  }

  return fetch(url).then((response) => response.json());
}
