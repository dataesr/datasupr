import BeneficiariesByRole from "../../../beneficiaries/charts/beneficiaries-by-role";
import MainBeneficiaries from "../../../beneficiaries/charts/main-beneficiaries";
import MainPartners from "../../../overview/charts/main-partners";
import Top10CountriesByTypeOfBeneficiaries from "../../../type-of-beneficiaries/charts/top-10-beneficiaries";
import TypeOfBeneficiariesEvolution from "../../../type-of-beneficiaries/charts/type-beneficiaries-evolution";

export default function EntitiesContent() {
  return (
    <div className="fr-pb-3w">
      {/* <MainPartners /> */}
      <BeneficiariesByRole />
      {/* <MainBeneficiaries />  */}
      {/* <Top10CountriesByTypeOfBeneficiaries />
      <TypeOfBeneficiariesEvolution /> */}
    </div>
  );
}
