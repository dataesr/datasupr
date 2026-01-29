import NationalSelector from "./components/national-selector";
import NationalContent from "./components/national-content";
import "./styles.scss";

export default function NationalView() {
  return (
    <main>
      <NationalSelector />
      <NationalContent />
    </main>
  );
}
