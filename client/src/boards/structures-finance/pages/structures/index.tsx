import { useSearchParams } from "react-router-dom";
import StructureSelection from "./components/structure-selector";
import StructureView from "./components/structure-view";
import "./styles.scss";

export default function StructuresView() {
  const [searchParams] = useSearchParams();
  const selectedStructure = searchParams.get("structureId");

  return selectedStructure ? <StructureView /> : <StructureSelection />;
}
