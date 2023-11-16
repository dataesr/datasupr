const { VITE_APP_SERVER_URL } = import.meta.env;

export async function get1(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students-map?${params}`
    return fetch(url).then((response) => (response.json()))
}