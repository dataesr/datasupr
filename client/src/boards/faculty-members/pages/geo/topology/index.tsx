import { useParams } from "react-router-dom";

export function GeoTopologie() {
  const { geoId } = useParams<{ geoId?: string }>();

  return (
    <div>
      <h1>Topologie</h1>
      {geoId && <p>geoId: {geoId}</p>}
    </div>
  );
}
