import countriesList from '../assets/data/custom.geo.json';

export default function getCountryName(isoCode, en = false) {
  if (en) return countriesList.features.find((el) => el.properties.iso_a2 === isoCode).properties.name;
  return countriesList.features.find((el) => el.properties.iso_a2 === isoCode).properties.name_fr;
}
