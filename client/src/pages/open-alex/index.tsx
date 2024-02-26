import RetractedByCountry from './charts/retracted-by-country';
import RetractedByCountryShare from './charts/retracted-by-country-share';
import RetractedByCountryByYear from './charts/retracted-by-country-by-year';
import RetractedFrenchByYear from './charts/retracted-french-by-year';
import RetractedFrenchByYearShare from './charts/retracted-french-by-year-share';

export default function Welcome() {
  return (
    <>
      <RetractedByCountry />
      <RetractedByCountryShare />
      <RetractedFrenchByYear />
      <RetractedFrenchByYearShare />
      <RetractedByCountryByYear />
    </>
  );
}
