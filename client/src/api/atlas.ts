const { VITE_APP_SERVER_URL } = import.meta.env;

export async function getNumberOfStudentsMap(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students-map?${params}`
    return fetch(url).then((response) => (response.json()))
}

export async function getNumberOfStudents(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students?${params}`
    return fetch(url).then((response) => (response.json()))
}

export async function getReferences(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/get-references?${params}`
    return fetch(url).then((response) => (response.json()))
}

export async function getNumberOfStudentsByYear(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students-by-year?${params}`
    return fetch(url).then((response) => (response.json()))
}

export async function getFiltersValues() {
    const url = `${VITE_APP_SERVER_URL}/atlas/get-filters-values`
    return fetch(url).then((response) => (response.json()))
}

export async function getNumberOfStudentsHistoricByLevel(geoId: string, currentYear: string) {
    let level = 'niveau_geo=REGION';
    if (geoId.startsWith('R')) { level = `niveau_geo=ACADEMIE&reg_id=${geoId}`; }
    if (geoId.startsWith('D')) { level = `niveau_geo=COMMUNE&dep_id=${geoId}`; }
    if (geoId.startsWith('A')) { level = `niveau_geo=DEPARTEMENT&aca_id=${geoId}`; }
    if (geoId.startsWith('U')) { level = `niveau_geo=COMMUNE&uucr_id=${geoId}`; }

    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students-historic-by-level?${level}`
    const data = await fetch(url).then((response) => (response.json()));

    // // Tri par effectif décroissant
    data.data.sort((a, b) => {
        const aEffectif = a.data.find((el) => el.annee_universitaire === currentYear)?.effectif;
        const bEffectif = b.data.find((el) => el.annee_universitaire === currentYear)?.effectif;
        return bEffectif - aEffectif;
    })
    return data;
}

export async function getNumberOfStudentsByGenderAndLevel(params: string) {
    const url = `${VITE_APP_SERVER_URL}/atlas/number-of-students-by-gender-and-level?${params}`
    return fetch(url).then((response) => (response.json()))
}

export async function getGeoPolygon(geoId: string) {
    if (!geoId) return null;
    const url = `${VITE_APP_SERVER_URL}/atlas/get-geo-polygons?originalId=${geoId}`
    console.log('getGeoPolygon', url);
    return fetch(url).then((response) => (response.json()))
}

export async function getSimilarElements({
    niveau_geo,
    needle,
    gt,
    lt,
    annee_universitaire
}: {
    niveau_geo: string,
    needle: string,
    gt: number,
    lt: number,
    annee_universitaire: string
}) {

    const url = `${VITE_APP_SERVER_URL}/atlas/get-similar-elements?niveau_geo=${niveau_geo}&needle=${needle}&gt=${gt}&lt=${lt}&annee_universitaire=${annee_universitaire}`
    return fetch(url).then((response) => (response.json()))
}