import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/personnel-enseignants/search">search</Link>
      <br />
      <Link to="/personnel-enseignants/synthese">synthese</Link>
    </div>
  );
}
