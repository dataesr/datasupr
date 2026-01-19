import { useSearchParams } from "react-router-dom";
import EstablishmentSelection from "./components/establishment-selection";
import EstablishmentView from "./components/establishment-view";
import "./styles.scss";

export default function StructuresView() {
  const [searchParams] = useSearchParams();
  const selectedEtablissement = searchParams.get("structureId");

  return selectedEtablissement ? (
    <EstablishmentView />
  ) : (
    <EstablishmentSelection />
  );
}
