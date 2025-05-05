import { useParams } from "react-router-dom";

export function GeoTypologie() {
  const { geoId } = useParams<{ geoId?: string }>();

  return (
    <div>
      <h1>Typologie</h1>
      {geoId && <p>geoId: {geoId}</p>}
    </div>
  );
}
