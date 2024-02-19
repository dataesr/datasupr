import { useQuery } from "@tanstack/react-query";
import Map from "../../../components/map.tsx";

import { getGeoPolygon } from "../../../api/atlas.ts";

export default function MapWithPolygon({
  autoCenter = false,
  id = '',
  height = '400px',
  width = '100%',
  zoomControl = true,
}: {
  autoCenter?: boolean,
  id: string,
  height?: string,
  width?: string,
  zoomControl?: boolean,
}) {

  let geoId = id;
  if (id.substring(0, 2) === 'UU') {
    geoId = id.substring(2);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/get-geo-polygons", geoId],
    queryFn: () => getGeoPolygon(geoId)
  })

  if (isLoading || !data || !data.length) {
    return <div>Loading...</div>
  }

  return (
    <section>
      <Map
        autoCenter={autoCenter}
        height={height}
        polygonCoordinates={data[0].geometry}
        width={width}
        zoomControl={zoomControl}
      />
    </section>
  );
}
