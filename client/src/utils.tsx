import Cookies from 'js-cookie';

type Geo = {
  geo_id: string,
  geo_nom: string,
}

type GeoData = {
  regions: Geo[],
  departements: Geo[],
  academies: Geo[],
  unites_urbaines: Geo[],
  communes: Geo[],
}

function getGeoLabel(needle: string, haystack: GeoData) {
  if (!haystack || !needle) {
    return 'vide';
  }

  let newHaystack: Geo[] = [];

  switch (needle.charAt(0)) {
    case 'R':
      newHaystack = haystack.regions;
      break;
    case 'D':
      newHaystack = haystack.departements;
      break;
    case 'A':
      newHaystack = haystack.academies;
      break;
    case 'U':
      newHaystack = haystack.unites_urbaines;
      break;
    default:
      newHaystack = haystack.communes;
  }

  const geo = newHaystack.find((item) => item.geo_id === needle)
  return geo ? geo.geo_nom : ''
}


const getfavoriteIdsInCookie = () => {
  if (Cookies.get("favoriteIds")) {
    return Cookies.get("favoriteIds") || '';
  }
  return '';
};

const getSortedfavoriteIdsInCookie = () => {
  const favoriteIds = getfavoriteIdsInCookie();
  // count number of items of each id
  // sort by number of items
  const favoriteIdsCount = {};
  favoriteIds.split(',').forEach(element => {
    if (favoriteIdsCount[element]) {
      favoriteIdsCount[element] += 1;
    } else {
      favoriteIdsCount[element] = 1;
    }
  });
  const sortedfavoriteIds = Object.keys(favoriteIdsCount).sort((a, b) => favoriteIdsCount[b] - favoriteIdsCount[a]);
  return sortedfavoriteIds;
}

const clearAllfavoriteIdsInCookie = () => {
  Cookies.remove('favoriteIds');
};

const setfavoriteIdsInCookie = (id: string) => {
  const oldCookie = getfavoriteIdsInCookie();
  clearAllfavoriteIdsInCookie();
  const newCookie = (oldCookie === '') ? id : (oldCookie + ',' + id);
  Cookies.set('favoriteIds', newCookie);
};

export {
  getGeoLabel,
  clearAllfavoriteIdsInCookie,
  setfavoriteIdsInCookie,
  getfavoriteIdsInCookie,
  getSortedfavoriteIdsInCookie
};
