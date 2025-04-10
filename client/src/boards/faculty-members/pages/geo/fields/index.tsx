import { useParams } from "react-router-dom";

export function GeoFields() {
  const { geoId } = useParams<{ geoId?: string }>();

  return (
    <div>
      <h1>Discipline</h1>
      {geoId && <p>geoId: {geoId}</p>}
    </div>
  );
}
