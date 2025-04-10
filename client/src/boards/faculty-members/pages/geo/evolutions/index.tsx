import { useParams } from "react-router-dom";

export function GeoEvolution() {
  const { geoId } = useParams<{ geoId?: string }>();

  return (
    <div>
      <h1>Evolution</h1>
      {geoId && <p>geoId: {geoId}</p>}
    </div>
  );
}
