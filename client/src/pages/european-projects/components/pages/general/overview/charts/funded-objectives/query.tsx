const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetfundedObjectives(params: string) {
  console.log("GetfundedObjectives", params);
  const newParamsObj = JSON.parse(
    '{"' +
      decodeURI(params)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  delete newParamsObj.entities;
  const newParams = new URLSearchParams(newParamsObj).toString();
  // TODO: Implement parameter entities ?

  let url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-funding_programme`;
  if (params !== "") {
    url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-funding_programme?${newParams}`;
  }

  return fetch(url).then((response) => response.json());
}
