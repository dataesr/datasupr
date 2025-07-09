const { VITE_APP_SERVER_URL } = import.meta.env;

export async function getCollaborations(entityId) {
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations-by-entity?entity_id=${entityId}`).then((response) =>
    response.json()
  );
}
