import Cookies from "js-cookie";
import { useSearchParams } from "react-router-dom";

const { VITE_APP_SERVER_URL } = import.meta.env;

type Geo = {
  geo_id: string;
  geo_nom: string;
};

type GeoData = {
  regions: Geo[];
  departements: Geo[];
  academies: Geo[];
  unites_urbaines: Geo[];
  communes: Geo[];
};

function getGeoLabel(needle: string, haystack: GeoData) {
  if (!haystack || !needle) {
    return "vide";
  }

  let newHaystack: Geo[] = [];

  switch (needle.charAt(0)) {
    case "R":
      newHaystack = haystack.regions;
      break;
    case "D":
      newHaystack = haystack.departements;
      break;
    case "A":
      newHaystack = haystack.academies;
      break;
    case "U":
      newHaystack = haystack.unites_urbaines;
      break;
    default:
      newHaystack = haystack.communes;
  }

  const geo = newHaystack.find((item) => item.geo_id === needle);

  return geo?.geo_nom || "France";
}

function getParentFromLevel(parents, geoId) {
  if (!parents) {
    return null;
  }
  if (geoId === "PAYS_100") {
    return null;
  }
  if (geoId === "D978") {
    return { geo_nom: parents.reg_nom, geo_id: parents.reg_id };
  }
  if (geoId.startsWith("R")) {
    return { geo_nom: "France", geo_id: "PAYS_100" };
  }
  if (geoId.startsWith("A")) {
    return { geo_nom: parents.reg_nom, geo_id: parents.reg_id };
  }
  if (geoId.startsWith("D")) {
    return { geo_nom: parents.aca_nom, geo_id: parents.aca_id };
  }
  if (geoId.startsWith("U")) {
    return { geo_nom: parents.reg_nom, geo_id: parents.reg_id };
  }

  // default = communes
  return { geo_nom: parents.dep_nom, geo_id: parents.dep_id };
}

const getfavoriteIdsInCookie = () => {
  if (Cookies.get("favoriteIds")) {
    return Cookies.get("favoriteIds") || "";
  }
  return "";
};

const getSortedfavoriteIdsInCookie = () => {
  const favoriteIds = getfavoriteIdsInCookie();
  // count number of items of each id
  // sort by number of items
  const favoriteIdsCount = {};
  favoriteIds.split(",").forEach((element) => {
    if (favoriteIdsCount[element]) {
      favoriteIdsCount[element] += 1;
    } else {
      favoriteIdsCount[element] = 1;
    }
  });
  const sortedfavoriteIds = Object.keys(favoriteIdsCount).sort((a, b) => favoriteIdsCount[b] - favoriteIdsCount[a]);
  return sortedfavoriteIds;
};

const clearAllfavoriteIdsInCookie = () => {
  Cookies.remove("favoriteIds");
};

const setfavoriteIdsInCookie = (id: string) => {
  const oldCookie = getfavoriteIdsInCookie();
  clearAllfavoriteIdsInCookie();
  const newCookie = oldCookie === "" ? id : oldCookie + "," + id;
  Cookies.set("favoriteIds", newCookie);
};

function getThemeFromHtmlNode() {
  const htmlNode = document.querySelector("html");
  return htmlNode?.getAttribute("data-fr-theme") || "light";
}

function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

async function getNeighbouringCountriesFromIso3(iso3: string) {
  if (!iso3) return [];
  try {
    const baseUrl = VITE_APP_SERVER_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/geo/get-from-iso3?iso3=${iso3}`);
    const data = await response.json();
    return data.borders ? data.borders.split(",") : [];
  } catch (error) {
    console.error("Error fetching neighbouring countries:", error);
    return [];
  }
}

function getI18nLabel(i18n: object, key: string) {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  try {
    return i18n[key][currentLang];
  } catch (error) {
    console.error(`No translation key ${key}`);
    return key;
  }
}

export {
  clearAllfavoriteIdsInCookie,
  getfavoriteIdsInCookie,
  getFlagEmoji,
  getGeoLabel,
  getI18nLabel,
  getNeighbouringCountriesFromIso3,
  getParentFromLevel,
  getSortedfavoriteIdsInCookie,
  getThemeFromHtmlNode,
  setfavoriteIdsInCookie
};

